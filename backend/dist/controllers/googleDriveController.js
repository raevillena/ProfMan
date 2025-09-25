"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.GoogleDriveController = void 0;
const googleDriveService_1 = require("../services/googleDriveService");
const multer_1 = __importDefault(require("multer"));
const googleDriveService = new googleDriveService_1.GoogleDriveService();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
            'video/mp4',
            'video/quicktime',
            'audio/mpeg',
            'audio/wav'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            const error = new Error('File type not allowed');
            cb(error);
        }
    }
});
exports.upload = upload;
class GoogleDriveController {
    async getOAuthUrl(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const authUrl = googleDriveService.generateAuthUrl(userId);
            res.status(200).json({
                success: true,
                data: { authUrl }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to generate OAuth URL'
                }
            });
        }
    }
    async handleCallback(req, res) {
        try {
            const { code, state } = req.query;
            if (!code || !state) {
                res.status(400).json({
                    success: false,
                    error: { code: 'MISSING_PARAMETERS', message: 'Code and state parameters are required' }
                });
                return;
            }
            const result = await googleDriveService.handleCallback(code, state);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Google Drive connected successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: { code: 'OAUTH_ERROR', message: result.error || 'OAuth callback failed' }
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'OAuth callback failed'
                }
            });
        }
    }
    async getConnectionStatus(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const isConnected = await googleDriveService.isConnected(userId);
            res.status(200).json({
                success: true,
                data: { isConnected }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to check connection status'
                }
            });
        }
    }
    async uploadFile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const file = req.file;
            if (!file) {
                res.status(400).json({
                    success: false,
                    error: { code: 'MISSING_FILE', message: 'No file provided' }
                });
                return;
            }
            const { folderId } = req.body;
            const result = await googleDriveService.uploadFile(userId, file.buffer, file.originalname, file.mimetype, folderId);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: { fileId: result.fileId },
                    message: 'File uploaded successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: { code: 'UPLOAD_ERROR', message: result.error || 'Upload failed' }
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Upload failed'
                }
            });
        }
    }
    async createFolder(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const { folderName, parentFolderId } = req.body;
            if (!folderName) {
                res.status(400).json({
                    success: false,
                    error: { code: 'MISSING_FOLDER_NAME', message: 'Folder name is required' }
                });
                return;
            }
            const result = await googleDriveService.createFolder(userId, folderName, parentFolderId);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: { folderId: result.folderId },
                    message: 'Folder created successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: { code: 'FOLDER_CREATION_ERROR', message: result.error || 'Folder creation failed' }
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Folder creation failed'
                }
            });
        }
    }
    async getFile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const { fileId } = req.params;
            if (!fileId) {
                res.status(400).json({
                    success: false,
                    error: { code: 'MISSING_FILE_ID', message: 'File ID is required' }
                });
                return;
            }
            const result = await googleDriveService.getFile(userId, fileId);
            if (result.success && result.fileBuffer) {
                res.setHeader('Content-Type', result.mimeType || 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
                res.send(result.fileBuffer);
            }
            else {
                res.status(404).json({
                    success: false,
                    error: { code: 'FILE_NOT_FOUND', message: result.error || 'File not found' }
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'File retrieval failed'
                }
            });
        }
    }
    async deleteFile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const { fileId } = req.params;
            if (!fileId) {
                res.status(400).json({
                    success: false,
                    error: { code: 'MISSING_FILE_ID', message: 'File ID is required' }
                });
                return;
            }
            const result = await googleDriveService.deleteFile(userId, fileId);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'File deleted successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: { code: 'DELETE_ERROR', message: result.error || 'File deletion failed' }
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'File deletion failed'
                }
            });
        }
    }
    async disconnect(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const result = await googleDriveService.disconnect(userId);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: 'Google Drive disconnected successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: { code: 'DISCONNECT_ERROR', message: result.error || 'Disconnect failed' }
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Disconnect failed'
                }
            });
        }
    }
}
exports.GoogleDriveController = GoogleDriveController;
//# sourceMappingURL=googleDriveController.js.map