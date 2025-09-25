import api from './api';
import {
  CreateExamRequest,
  UpdateExamRequest,
  SubmitExamRequest,
  GradeExamRequest,
  ExamResponse
} from '../types/exam';

export const examService = {
  // Create exam
  async createExam(data: CreateExamRequest): Promise<ExamResponse> {
    const response = await api.post('/exams', data);
    return response.data;
  },

  // Get exam by ID
  async getExamById(id: string): Promise<ExamResponse> {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  // Get exams by branch
  async getExamsByBranch(branchId: string, isActive?: boolean): Promise<ExamResponse> {
    const response = await api.get(`/exams/branch/${branchId}`, {
      params: isActive !== undefined ? { isActive } : {}
    });
    return response.data;
  },

  // Get exams by professor
  async getExamsByProfessor(isActive?: boolean): Promise<ExamResponse> {
    const response = await api.get('/exams/professor', {
      params: isActive !== undefined ? { isActive } : {}
    });
    return response.data;
  },

  // Update exam
  async updateExam(id: string, data: UpdateExamRequest): Promise<ExamResponse> {
    const response = await api.patch(`/exams/${id}`, data);
    return response.data;
  },

  // Delete exam
  async deleteExam(id: string): Promise<{ success: boolean; message?: string; error?: { code: string; message: string } }> {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },

  // Submit exam
  async submitExam(examId: string, data: SubmitExamRequest): Promise<ExamResponse> {
    const response = await api.post(`/exams/${examId}/submit`, data);
    return response.data;
  },

  // Get exam submissions
  async getExamSubmissions(examId: string, studentId?: string): Promise<ExamResponse> {
    const response = await api.get(`/exams/${examId}/submissions`, {
      params: studentId ? { studentId } : {}
    });
    return response.data;
  },

  // Grade exam submission
  async gradeExamSubmission(data: GradeExamRequest): Promise<ExamResponse> {
    const response = await api.patch(`/exams/submissions/${data.submissionId}/grade`, data);
    return response.data;
  },

  // Upload exam file
  async uploadExamFile(file: File): Promise<{ success: boolean; fileId?: string; error?: { code: string; message: string } }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/exams/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
