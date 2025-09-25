import { Timestamp } from 'firebase-admin/firestore';

export interface Exam {
  id: string;
  branchId: string;
  professorId: string;
  title: string;
  description?: string;
  instructions?: string;
  totalPoints: number;
  timeLimit?: number; // in minutes
  dueDate: Timestamp;
  isActive: boolean;
  allowLateSubmission: boolean;
  maxAttempts?: number;
  questions: ExamQuestion[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ExamQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'file_upload';
  question: string;
  points: number;
  options?: string[]; // for multiple choice and true/false
  correctAnswer?: string | string[]; // for auto-grading
  fileTypes?: string[]; // for file upload questions
  maxFileSize?: number; // in MB
  isRequired: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: ExamAnswer[];
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  grade: string;
  submittedAt: Timestamp;
  isLate: boolean;
  attemptNumber: number;
  status: 'draft' | 'submitted' | 'graded';
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Timestamp;
}

export interface ExamAnswer {
  questionId: string;
  answer: string | string[] | FileUpload[];
  points?: number;
  feedback?: string;
}

export interface FileUpload {
  fileName: string;
  fileId: string; // Google Drive file ID
  fileSize: number;
  mimeType: string;
  uploadedAt: Timestamp;
}

export interface CreateExamRequest {
  branchId: string;
  title: string;
  description?: string;
  instructions?: string;
  totalPoints: number;
  timeLimit?: number;
  dueDate: string;
  allowLateSubmission: boolean;
  maxAttempts?: number;
  questions: Omit<ExamQuestion, 'id'>[];
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  instructions?: string;
  totalPoints?: number;
  timeLimit?: number;
  dueDate?: string;
  isActive?: boolean;
  allowLateSubmission?: boolean;
  maxAttempts?: number;
  questions?: Omit<ExamQuestion, 'id'>[];
}

export interface SubmitExamRequest {
  answers: Omit<ExamAnswer, 'points' | 'feedback'>[];
}

export interface GradeExamRequest {
  submissionId: string;
  answers: Array<{
    questionId: string;
    points: number;
    feedback?: string;
  }>;
  overallFeedback?: string;
}

export interface ExamResponse {
  success: boolean;
  data?: {
    exam?: Exam;
    exams?: Exam[];
    submission?: ExamSubmission;
    submissions?: ExamSubmission[];
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