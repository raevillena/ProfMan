import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { getFirestore } from '../utils/firebase';
import { User } from '../models/User';
import { Timestamp } from 'firebase-admin/firestore';

export class GoogleDriveService {
  private db = getFirestore();
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.DRIVE_CLIENT_ID,
      process.env.DRIVE_CLIENT_SECRET,
      process.env.DRIVE_REDIRECT_URI
    );
  }

  // Generate OAuth2 authorization URL
  generateAuthUrl(userId: string): string {
    const state = this.encryptState({ userId, timestamp: Date.now() });
    
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets'
      ],
      prompt: 'consent',
      state: state
    });
  }

  // Handle OAuth2 callback and exchange code for tokens
  async handleCallback(code: string, state: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      // Decrypt and validate state
      const stateData = this.decryptState(state);
      if (!stateData || !stateData.userId) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for tokens
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const userInfo = await oauth2.userinfo.get();

      // Encrypt refresh token
      const encryptedRefreshToken = this.encrypt(tokens.refresh_token || '');

      // Update user with Google Drive config
      const userRef = this.db.collection('users').doc(stateData.userId);
      await userRef.update({
        googleDrive: {
          driveId: userInfo.data.id || '',
          accessToken: tokens.access_token || '',
          refreshTokenEncrypted: encryptedRefreshToken,
          connectedAt: Timestamp.fromDate(new Date())
        },
        updatedAt: Timestamp.fromDate(new Date())
      });

      return { success: true, userId: stateData.userId };
    } catch (error) {
      console.error('Google Drive OAuth callback error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'OAuth callback failed' 
      };
    }
  }

  // Get user's Google Drive client
  async getUserDriveClient(userId: string): Promise<OAuth2Client | null> {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data() as User;
      if (!userData.googleDrive) {
        throw new Error('Google Drive not connected');
      }

      // Decrypt refresh token
      const refreshToken = this.decrypt(userData.googleDrive.refreshTokenEncrypted);
      
      // Set up OAuth2 client with user's tokens
      const client = new google.auth.OAuth2(
        process.env.DRIVE_CLIENT_ID,
        process.env.DRIVE_CLIENT_SECRET,
        process.env.DRIVE_REDIRECT_URI
      );

      client.setCredentials({
        access_token: userData.googleDrive.accessToken,
        refresh_token: refreshToken
      });

      // Refresh token if needed
      try {
        await client.getAccessToken();
      } catch (error) {
        console.log('Refreshing Google Drive token...');
        const { credentials } = await client.refreshAccessToken();
        
        // Update stored access token
        const encryptedRefreshToken = this.encrypt(credentials.refresh_token || refreshToken);
        await userDoc.ref.update({
          'googleDrive.accessToken': credentials.access_token,
          'googleDrive.refreshTokenEncrypted': encryptedRefreshToken,
          updatedAt: Timestamp.fromDate(new Date())
        });

        client.setCredentials(credentials);
      }

      return client;
    } catch (error) {
      console.error('Error getting user drive client:', error);
      return null;
    }
  }

  // Upload file to Google Drive
  async uploadFile(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string, folderId?: string): Promise<{ success: boolean; fileId?: string; error?: string }> {
    try {
      const driveClient = await this.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const drive = google.drive({ version: 'v3', auth: driveClient });

      const fileMetadata: any = {
        name: fileName,
        parents: folderId ? [folderId] : undefined
      };

      const media = {
        mimeType: mimeType,
        body: fileBuffer
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink'
      });

      return { 
        success: true, 
        fileId: response.data.id || undefined 
      };
    } catch (error) {
      console.error('Error uploading file to Google Drive:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  // Create folder in Google Drive
  async createFolder(userId: string, folderName: string, parentFolderId?: string): Promise<{ success: boolean; folderId?: string; error?: string }> {
    try {
      const driveClient = await this.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const drive = google.drive({ version: 'v3', auth: driveClient });

      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        fields: 'id,name'
      });

      return { 
        success: true, 
        folderId: response.data.id || undefined 
      };
    } catch (error) {
      console.error('Error creating folder in Google Drive:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Folder creation failed' 
      };
    }
  }

  // Get file from Google Drive
  async getFile(userId: string, fileId: string): Promise<{ success: boolean; fileBuffer?: Buffer; fileName?: string; mimeType?: string; error?: string }> {
    try {
      const driveClient = await this.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const drive = google.drive({ version: 'v3', auth: driveClient });

      // Get file metadata
      const fileMetadata = await drive.files.get({
        fileId: fileId,
        fields: 'name,mimeType'
      });

      // Download file content
      const response = await drive.files.get({
        fileId: fileId,
        alt: 'media'
      }, { responseType: 'stream' });

      const chunks: Buffer[] = [];
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.data.on('end', () => {
          const fileBuffer = Buffer.concat(chunks);
          resolve({
            success: true,
            fileBuffer,
            fileName: fileMetadata.data.name || 'unknown',
            mimeType: fileMetadata.data.mimeType || 'application/octet-stream'
          });
        });
        response.data.on('error', (error) => {
          reject({ success: false, error: error.message });
        });
      });
    } catch (error) {
      console.error('Error getting file from Google Drive:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'File retrieval failed' 
      };
    }
  }

  // Delete file from Google Drive
  async deleteFile(userId: string, fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const driveClient = await this.getUserDriveClient(userId);
      if (!driveClient) {
        throw new Error('Google Drive not connected');
      }

      const drive = google.drive({ version: 'v3', auth: driveClient });
      await drive.files.delete({ fileId });

      return { success: true };
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'File deletion failed' 
      };
    }
  }

  // Check if user has Google Drive connected
  async isConnected(userId: string): Promise<boolean> {
    try {
      const userDoc = await this.db.collection('users').doc(userId).get();
      if (!userDoc.exists) return false;

      const userData = userDoc.data() as User;
      return !!(userData.googleDrive && userData.googleDrive.accessToken);
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
      return false;
    }
  }

  // Disconnect Google Drive
  async disconnect(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const userRef = this.db.collection('users').doc(userId);
      await userRef.update({
        googleDrive: null,
        updatedAt: Timestamp.fromDate(new Date())
      });

      return { success: true };
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Disconnect failed' 
      };
    }
  }

  // Encryption/Decryption helpers
  private encrypt(text: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.DRIVE_ENCRYPTION_KEY || '', 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(encryptedText: string): string {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.DRIVE_ENCRYPTION_KEY || '', 'hex');
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex || '', 'hex');
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encrypted || '', 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  private encryptState(data: any): string {
    const jsonString = JSON.stringify(data);
    return Buffer.from(jsonString).toString('base64');
  }

  private decryptState(encryptedState: string): any {
    try {
      const jsonString = Buffer.from(encryptedState, 'base64').toString('utf8');
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  }
}
