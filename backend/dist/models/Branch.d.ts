import { Timestamp } from 'firebase-admin/firestore';
export interface WeekContent {
    weekNumber: number;
    title: string;
    description: string;
    resources: {
        type: 'video' | 'document' | 'link' | 'quiz' | 'assignment';
        title: string;
        url?: string;
        fileId?: string;
        description?: string;
    }[];
    assignments: {
        title: string;
        description: string;
        dueDate: Timestamp;
        points: number;
        type: 'quiz' | 'exam' | 'assignment' | 'project';
    }[];
}
export interface Branch {
    id: string;
    subjectId: string;
    professorId: string;
    title: string;
    description: string;
    weekStructure: WeekContent[];
    isActive: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export interface CreateBranchRequest {
    subjectId: string;
    professorId: string;
    title: string;
    description: string;
    weekStructure: WeekContent[];
}
export interface UpdateBranchRequest {
    title?: string;
    description?: string;
    weekStructure?: WeekContent[];
    isActive?: boolean;
}
export interface BranchResponse {
    success: boolean;
    data?: {
        branch?: Branch;
        branches?: Branch[];
        total?: number;
        page?: number;
        totalPages?: number;
    };
    error?: {
        code: string;
        message: string;
    };
    message?: string;
}
//# sourceMappingURL=Branch.d.ts.map