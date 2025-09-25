import { Branch, CreateBranchRequest, UpdateBranchRequest } from '../models/Branch';
export declare class BranchService {
    private db;
    getBranches(params: {
        page?: number;
        limit?: number;
        subjectId?: string;
        professorId?: string;
        isActive?: boolean;
        search?: string;
    }): Promise<{
        branches: Branch[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getBranchById(branchId: string): Promise<Branch | null>;
    createBranch(branchData: CreateBranchRequest): Promise<Branch>;
    updateBranch(branchId: string, updates: UpdateBranchRequest): Promise<Branch>;
    deleteBranch(branchId: string): Promise<void>;
    restoreBranch(branchId: string): Promise<void>;
    permanentlyDeleteBranch(branchId: string): Promise<void>;
    getBranchesByProfessor(professorId: string): Promise<Branch[]>;
    getBranchesBySubject(subjectId: string): Promise<Branch[]>;
    getActiveBranches(): Promise<Branch[]>;
    cloneBranch(branchId: string, newProfessorId: string, newTitle: string): Promise<Branch>;
}
//# sourceMappingURL=branchService.d.ts.map