import { Timestamp } from 'firebase-admin/firestore';
export interface QuizQuestion {
    id: string;
    type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'short_answer' | 'numeric';
    question: string;
    options?: string[];
    correctAnswer: string | string[] | number;
    points: number;
    explanation?: string;
}
export interface Quiz {
    id: string;
    branchId: string;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    totalPoints: number;
    timeLimit?: number;
    attemptsAllowed: number;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export interface CreateQuizRequest {
    branchId: string;
    title: string;
    description?: string;
    questions: Omit<QuizQuestion, 'id'>[];
    timeLimit?: number;
    attemptsAllowed: number;
}
export interface UpdateQuizRequest {
    title?: string;
    description?: string;
    questions?: Omit<QuizQuestion, 'id'>[];
    timeLimit?: number;
    attemptsAllowed?: number;
    isActive?: boolean;
}
export interface QuizAttempt {
    id: string;
    quizId: string;
    studentId: string;
    answers: Record<string, string | string[] | number>;
    score: number;
    totalPoints: number;
    percentage: number;
    timeSpent: number;
    isCompleted: boolean;
    submittedAt: Timestamp;
    gradedAt?: Timestamp;
}
export interface SubmitQuizAttemptRequest {
    quizId: string;
    answers: Record<string, string | string[] | number>;
    timeSpent: number;
}
//# sourceMappingURL=Quiz.d.ts.map