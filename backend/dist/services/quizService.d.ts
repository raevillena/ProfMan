import { Quiz, CreateQuizRequest, UpdateQuizRequest, QuizAttempt, SubmitQuizAttemptRequest } from '../models/Quiz';
export declare class QuizService {
    private db;
    getQuizzes(params: {
        page?: number;
        limit?: number;
        search?: string;
        isActive?: boolean;
        isDeleted?: boolean;
        branchId?: string;
    }): Promise<{
        quizzes: Quiz[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getQuizById(id: string): Promise<Quiz | null>;
    createQuiz(quizData: CreateQuizRequest): Promise<Quiz>;
    updateQuiz(id: string, updates: UpdateQuizRequest): Promise<Quiz | null>;
    deleteQuiz(id: string): Promise<void>;
    restoreQuiz(id: string): Promise<void>;
    permanentlyDeleteQuiz(id: string): Promise<void>;
    getQuizzesByBranch(branchId: string): Promise<Quiz[]>;
    submitQuizAttempt(attemptData: SubmitQuizAttemptRequest, studentId: string): Promise<QuizAttempt>;
    private autoGradeQuiz;
    private isAnswerCorrect;
    getQuizAttemptsByStudent(studentId: string, quizId?: string): Promise<QuizAttempt[]>;
    getQuizAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]>;
    getBestQuizAttempt(studentId: string, quizId: string): Promise<QuizAttempt | null>;
}
//# sourceMappingURL=quizService.d.ts.map