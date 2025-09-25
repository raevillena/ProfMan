import { OAuth2Client } from 'google-auth-library';
export declare class GoogleDriveService {
    private db;
    private oauth2Client;
    constructor();
    generateAuthUrl(userId: string): string;
    handleCallback(code: string, state: string): Promise<{
        success: boolean;
        userId?: string;
        error?: string;
    }>;
    getUserDriveClient(userId: string): Promise<OAuth2Client | null>;
    uploadFile(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string, folderId?: string): Promise<{
        success: boolean;
        fileId?: string;
        error?: string;
    }>;
    createFolder(userId: string, folderName: string, parentFolderId?: string): Promise<{
        success: boolean;
        folderId?: string;
        error?: string;
    }>;
    getFile(userId: string, fileId: string): Promise<{
        success: boolean;
        fileBuffer?: Buffer;
        fileName?: string;
        mimeType?: string;
        error?: string;
    }>;
    deleteFile(userId: string, fileId: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    isConnected(userId: string): Promise<boolean>;
    disconnect(userId: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    private encrypt;
    private decrypt;
    private encryptState;
    private decryptState;
}
//# sourceMappingURL=googleDriveService.d.ts.map