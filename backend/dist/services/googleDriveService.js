"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleDriveService = void 0;
const googleapis_1 = require("googleapis");
const crypto_1 = __importDefault(require("crypto"));
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase-admin/firestore");
class GoogleDriveService {
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.DRIVE_CLIENT_ID, process.env.DRIVE_CLIENT_SECRET, process.env.DRIVE_REDIRECT_URI);
    }
    generateAuthUrl(userId) {
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
    async handleCallback(code, state) {
        try {
            const stateData = this.decryptState(state);
            if (!stateData || !stateData.userId) {
                throw new Error('Invalid state parameter');
            }
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: this.oauth2Client });
            const userInfo = await oauth2.userinfo.get();
            const encryptedRefreshToken = this.encrypt(tokens.refresh_token || '');
            const userRef = this.db.collection('users').doc(stateData.userId);
            await userRef.update({
                googleDrive: {
                    driveId: userInfo.data.id || '',
                    accessToken: tokens.access_token || '',
                    refreshTokenEncrypted: encryptedRefreshToken,
                    connectedAt: firestore_1.Timestamp.fromDate(new Date())
                },
                updatedAt: firestore_1.Timestamp.fromDate(new Date())
            });
            return { success: true, userId: stateData.userId };
        }
        catch (error) {
            console.error('Google Drive OAuth callback error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'OAuth callback failed'
            };
        }
    }
    async getUserDriveClient(userId) {
        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                throw new Error('User not found');
            }
            const userData = userDoc.data();
            if (!userData.googleDrive) {
                throw new Error('Google Drive not connected');
            }
            const refreshToken = this.decrypt(userData.googleDrive.refreshTokenEncrypted);
            const client = new googleapis_1.google.auth.OAuth2(process.env.DRIVE_CLIENT_ID, process.env.DRIVE_CLIENT_SECRET, process.env.DRIVE_REDIRECT_URI);
            client.setCredentials({
                access_token: userData.googleDrive.accessToken,
                refresh_token: refreshToken
            });
            try {
                await client.getAccessToken();
            }
            catch (error) {
                console.log('Refreshing Google Drive token...');
                const { credentials } = await client.refreshAccessToken();
                const encryptedRefreshToken = this.encrypt(credentials.refresh_token || refreshToken);
                await userDoc.ref.update({
                    'googleDrive.accessToken': credentials.access_token,
                    'googleDrive.refreshTokenEncrypted': encryptedRefreshToken,
                    updatedAt: firestore_1.Timestamp.fromDate(new Date())
                });
                client.setCredentials(credentials);
            }
            return client;
        }
        catch (error) {
            console.error('Error getting user drive client:', error);
            return null;
        }
    }
    async uploadFile(userId, fileBuffer, fileName, mimeType, folderId) {
        try {
            const driveClient = await this.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const drive = googleapis_1.google.drive({ version: 'v3', auth: driveClient });
            const fileMetadata = {
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
        }
        catch (error) {
            console.error('Error uploading file to Google Drive:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Upload failed'
            };
        }
    }
    async createFolder(userId, folderName, parentFolderId) {
        try {
            const driveClient = await this.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const drive = googleapis_1.google.drive({ version: 'v3', auth: driveClient });
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
        }
        catch (error) {
            console.error('Error creating folder in Google Drive:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Folder creation failed'
            };
        }
    }
    async getFile(userId, fileId) {
        try {
            const driveClient = await this.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const drive = googleapis_1.google.drive({ version: 'v3', auth: driveClient });
            const fileMetadata = await drive.files.get({
                fileId: fileId,
                fields: 'name,mimeType'
            });
            const response = await drive.files.get({
                fileId: fileId,
                alt: 'media'
            }, { responseType: 'stream' });
            const chunks = [];
            return new Promise((resolve, reject) => {
                response.data.on('data', (chunk) => chunks.push(chunk));
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
        }
        catch (error) {
            console.error('Error getting file from Google Drive:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'File retrieval failed'
            };
        }
    }
    async deleteFile(userId, fileId) {
        try {
            const driveClient = await this.getUserDriveClient(userId);
            if (!driveClient) {
                throw new Error('Google Drive not connected');
            }
            const drive = googleapis_1.google.drive({ version: 'v3', auth: driveClient });
            await drive.files.delete({ fileId });
            return { success: true };
        }
        catch (error) {
            console.error('Error deleting file from Google Drive:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'File deletion failed'
            };
        }
    }
    async isConnected(userId) {
        try {
            const userDoc = await this.db.collection('users').doc(userId).get();
            if (!userDoc.exists)
                return false;
            const userData = userDoc.data();
            return !!(userData.googleDrive && userData.googleDrive.accessToken);
        }
        catch (error) {
            console.error('Error checking Google Drive connection:', error);
            return false;
        }
    }
    async disconnect(userId) {
        try {
            const userRef = this.db.collection('users').doc(userId);
            await userRef.update({
                googleDrive: null,
                updatedAt: firestore_1.Timestamp.fromDate(new Date())
            });
            return { success: true };
        }
        catch (error) {
            console.error('Error disconnecting Google Drive:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Disconnect failed'
            };
        }
    }
    encrypt(text) {
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.DRIVE_ENCRYPTION_KEY || '', 'hex');
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipher(algorithm, key);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }
    decrypt(encryptedText) {
        const algorithm = 'aes-256-gcm';
        const key = Buffer.from(process.env.DRIVE_ENCRYPTION_KEY || '', 'hex');
        const [ivHex, encrypted] = encryptedText.split(':');
        const iv = Buffer.from(ivHex || '', 'hex');
        const decipher = crypto_1.default.createDecipher(algorithm, key);
        let decrypted = decipher.update(encrypted || '', 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    encryptState(data) {
        const jsonString = JSON.stringify(data);
        return Buffer.from(jsonString).toString('base64');
    }
    decryptState(encryptedState) {
        try {
            const jsonString = Buffer.from(encryptedState, 'base64').toString('utf8');
            return JSON.parse(jsonString);
        }
        catch (error) {
            return null;
        }
    }
}
exports.GoogleDriveService = GoogleDriveService;
//# sourceMappingURL=googleDriveService.js.map