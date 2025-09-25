import { Request, Response } from 'express';
export declare class SubjectController {
    getSubjects(req: Request, res: Response): Promise<void>;
    getSubjectById(req: Request, res: Response): Promise<void>;
    getSubjectByCode(req: Request, res: Response): Promise<void>;
    createSubject(req: Request, res: Response): Promise<void>;
    updateSubject(req: Request, res: Response): Promise<void>;
    deleteSubject(req: Request, res: Response): Promise<void>;
    restoreSubject(req: Request, res: Response): Promise<void>;
    permanentlyDeleteSubject(req: Request, res: Response): Promise<void>;
    getActiveSubjects(req: Request, res: Response): Promise<void>;
    getSubjectsByProfessor(req: Request, res: Response): Promise<void>;
    assignSubjectToProfessors(req: Request, res: Response): Promise<void>;
    getAssignedProfessors(req: Request, res: Response): Promise<void>;
    getSubjectsAssignedToProfessor(req: Request, res: Response): Promise<void>;
    removeProfessorAssignment(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=subjectController.d.ts.map