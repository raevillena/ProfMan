export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'short_answer' | 'numeric';
  question: string;
  options?: string[]; // For multiple choice/select questions
  correctAnswer: string | string[] | number; // Single answer, multiple answers, or numeric value
  points: number;
  explanation?: string; // Optional explanation for the answer
}

export interface Quiz {
  id: string;
  branchId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  totalPoints: number;
  timeLimit?: number; // Time limit in minutes
  attemptsAllowed: number; // -1 for unlimited
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
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
  answers: Record<string, string | string[] | number>; // questionId -> answer
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpent: number; // Time spent in seconds
  isCompleted: boolean;
  submittedAt: string; // ISO string
  gradedAt?: string; // ISO string
}

export interface SubmitQuizAttemptRequest {
  quizId: string;
  answers: Record<string, string | string[] | number>;
  timeSpent: number;
}

export interface QuizFormData {
  title: string;
  description: string;
  timeLimit: number;
  attemptsAllowed: number;
  questions: Omit<QuizQuestion, 'id'>[];
}
