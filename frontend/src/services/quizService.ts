import api from './api';
import { Quiz, CreateQuizRequest, UpdateQuizRequest, QuizAttempt, SubmitQuizAttemptRequest } from '../types/quiz';

interface QuizzesResponse {
  quizzes: Quiz[];
  total: number;
  page: number;
  totalPages: number;
}

export const quizService = {
  async getQuizzes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    branchId?: string;
  }): Promise<QuizzesResponse> {
    const response = await api.get('/quizzes', { params });
    return response.data.data;
  },

  async getQuizById(id: string): Promise<Quiz> {
    const response = await api.get(`/quizzes/${id}`);
    return response.data.data;
  },

  async createQuiz(quizData: CreateQuizRequest): Promise<Quiz> {
    const response = await api.post('/quizzes', quizData);
    return response.data.data;
  },

  async updateQuiz(id: string, updates: UpdateQuizRequest): Promise<Quiz> {
    const response = await api.patch(`/quizzes/${id}`, updates);
    return response.data.data;
  },

  async deleteQuiz(id: string): Promise<void> {
    await api.delete(`/quizzes/${id}`);
  },

  async restoreQuiz(id: string): Promise<void> {
    await api.post(`/quizzes/${id}/restore`);
  },

  async permanentlyDeleteQuiz(id: string): Promise<void> {
    await api.delete(`/quizzes/${id}/permanent`);
  },

  async getQuizzesByBranch(branchId: string): Promise<Quiz[]> {
    const response = await api.get(`/quizzes/branch/${branchId}`);
    return response.data.data;
  },

  async submitQuizAttempt(attemptData: SubmitQuizAttemptRequest): Promise<QuizAttempt> {
    const response = await api.post('/quizzes/submit', attemptData);
    return response.data.data;
  },

  async getQuizAttemptsByStudent(studentId: string, quizId?: string): Promise<QuizAttempt[]> {
    const params = quizId ? { quizId } : {};
    const response = await api.get(`/quizzes/attempts/student/${studentId}`, { params });
    return response.data.data;
  },

  async getQuizAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
    const response = await api.get(`/quizzes/attempts/quiz/${quizId}`);
    return response.data.data;
  },

  async getBestQuizAttempt(studentId: string, quizId: string): Promise<QuizAttempt | null> {
    try {
      const response = await api.get(`/quizzes/attempts/best/${studentId}/${quizId}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};
