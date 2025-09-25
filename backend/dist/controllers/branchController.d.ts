import { Request, Response } from 'express';
export declare class BranchController {
    getBranches(req: Request, res: Response): Promise<void>;
    getBranchById(req: Request, res: Response): Promise<void>;
    createBranch(req: Request, res: Response): Promise<void>;
    updateBranch(req: Request, res: Response): Promise<void>;
    deleteBranch(req: Request, res: Response): Promise<void>;
    restoreBranch(req: Request, res: Response): Promise<void>;
    permanentlyDeleteBranch(req: Request, res: Response): Promise<void>;
    getBranchesByProfessor(req: Request, res: Response): Promise<void>;
    getBranchesBySubject(req: Request, res: Response): Promise<void>;
    getActiveBranches(req: Request, res: Response): Promise<void>;
    cloneBranch(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=branchController.d.ts.map