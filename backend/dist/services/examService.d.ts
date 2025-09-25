import { Exam, ExamSubmission, CreateExamRequest, UpdateExamRequest, SubmitExamRequest, GradeExamRequest } from '../models/Exam';
export declare class ExamService {
    private db;
    private googleDriveService;
    createExam(examData: CreateExamRequest, professorId: string): Promise<Exam>;
    getExamById(examId: string): Promise<Exam | null>;
    getExamsByBranch(branchId: string, isActive?: boolean): Promise<Exam[]>;
    getExamsByProfessor(professorId: string, isActive?: boolean): Promise<Exam[]>;
    updateExam(examId: string, updateData: UpdateExamRequest): Promise<Exam>;
    deleteExam(examId: string): Promise<void>;
    submitExam(examId: string, studentId: string, studentName: string, submissionData: SubmitExamRequest): Promise<ExamSubmission>;
    getExamSubmissions(examId: string, studentId?: string): Promise<ExamSubmission[]>;
    gradeExamSubmission(submissionId: string, gradeData: GradeExamRequest, gradedBy: string): Promise<ExamSubmission>;
    uploadExamFile(userId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<{
        success: boolean;
        fileId?: string;
        error?: string;
    }>;
    private calculateGrade;
    private getNextAttemptNumber;
}
//# sourceMappingURL=examService.d.ts.map