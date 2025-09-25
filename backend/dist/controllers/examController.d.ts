import { Request, Response } from 'express';
import multer from 'multer';
declare const upload: multer.Multer;
export declare class ExamController {
    createExam(req: Request, res: Response): Promise<void>;
    getExamById(req: Request, res: Response): Promise<void>;
    getExamsByBranch(req: Request, res: Response): Promise<void>;
    getExamsByProfessor(req: Request, res: Response): Promise<void>;
    updateExam(req: Request, res: Response): Promise<void>;
    deleteExam(req: Request, res: Response): Promise<void>;
    submitExam(req: Request, res: Response): Promise<void>;
    getExamSubmissions(req: Request, res: Response): Promise<void>;
    gradeExamSubmission(req: Request, res: Response): Promise<void>;
    uploadExamFile(req: Request, res: Response): Promise<void>;
}
export { upload };
//# sourceMappingURL=examController.d.ts.map