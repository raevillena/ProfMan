import { Subject, CreateSubjectRequest, UpdateSubjectRequest, AssignSubjectRequest } from '../models/Subject';
import { Timestamp } from 'firebase-admin/firestore';
export declare class SubjectService {
    private db;
    getSubjects(params: {
        page?: number;
        limit?: number;
        isActive?: boolean;
        search?: string;
    }): Promise<{
        subjects: Subject[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getSubjectById(subjectId: string): Promise<Subject | null>;
    getSubjectByCode(code: string): Promise<Subject | null>;
    createSubject(subjectData: CreateSubjectRequest, createdBy: string): Promise<Subject>;
    updateSubject(subjectId: string, updates: UpdateSubjectRequest): Promise<Subject>;
    deleteSubject(subjectId: string): Promise<void>;
    restoreSubject(subjectId: string): Promise<void>;
    permanentlyDeleteSubject(subjectId: string): Promise<void>;
    getActiveSubjects(): Promise<Subject[]>;
    getSubjectsByProfessor(professorId: string): Promise<Subject[]>;
    assignSubjectToProfessors(subjectId: string, assignmentData: AssignSubjectRequest, assignedBy: string): Promise<Subject>;
    getAssignedProfessors(subjectId: string): Promise<{
        professorId: string;
        assignedAt: Timestamp;
        assignedBy: string;
    }[]>;
    getSubjectsAssignedToProfessor(professorId: string): Promise<Subject[]>;
    removeProfessorAssignment(subjectId: string, professorId: string): Promise<void>;
}
//# sourceMappingURL=subjectService.d.ts.map