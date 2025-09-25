import { Request, Response } from 'express';
export declare class AdminController {
    getUsers(req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
    restoreUser(req: Request, res: Response): Promise<void>;
    permanentlyDeleteUser(req: Request, res: Response): Promise<void>;
    getProfessors(req: Request, res: Response): Promise<void>;
    getStudents(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=adminController.d.ts.map