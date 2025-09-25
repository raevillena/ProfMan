import { Timestamp } from 'firebase-admin/firestore';
export interface Subject {
    id: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    isActive: boolean;
    assignedProfessors: string[];
    createdBy: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export interface CreateSubjectRequest {
    code: string;
    title: string;
    description: string;
    credits: number;
    assignedProfessors?: string[];
}
export interface UpdateSubjectRequest {
    code?: string;
    title?: string;
    description?: string;
    credits?: number;
    isActive?: boolean;
    assignedProfessors?: string[];
}
export interface AssignSubjectRequest {
    professorIds: string[];
}
export interface SubjectAssignment {
    subjectId: string;
    professorId: string;
    assignedAt: Timestamp;
    assignedBy: string;
}
export interface SubjectResponse {
    success: boolean;
    data?: {
        subject?: Subject;
        subjects?: Subject[];
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
//# sourceMappingURL=Subject.d.ts.map