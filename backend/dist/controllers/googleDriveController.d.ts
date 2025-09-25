import { Request, Response } from 'express';
import multer from 'multer';
declare const upload: multer.Multer;
export declare class GoogleDriveController {
    getOAuthUrl(req: Request, res: Response): Promise<void>;
    handleCallback(req: Request, res: Response): Promise<void>;
    getConnectionStatus(req: Request, res: Response): Promise<void>;
    uploadFile(req: Request, res: Response): Promise<void>;
    createFolder(req: Request, res: Response): Promise<void>;
    getFile(req: Request, res: Response): Promise<void>;
    deleteFile(req: Request, res: Response): Promise<void>;
    disconnect(req: Request, res: Response): Promise<void>;
}
export { upload };
//# sourceMappingURL=googleDriveController.d.ts.map