import api from './api';
import {
  CreateSubjectRequest,
  UpdateSubjectRequest,
  AssignSubjectRequest,
  SubjectResponse,
  Subject
} from '../types/subject';

export const subjectService = {
  async getSubjects(params: { 
    page?: number; 
    limit?: number; 
    isActive?: boolean; 
    search?: string; 
  } = {}): Promise<SubjectResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await api.get(`/subjects?${queryParams.toString()}`);
    return response.data;
  },

  async getSubjectById(id: string): Promise<SubjectResponse> {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  async getSubjectByCode(code: string): Promise<SubjectResponse> {
    const response = await api.get(`/subjects/code/${code}`);
    return response.data;
  },

  async createSubject(subjectData: CreateSubjectRequest): Promise<SubjectResponse> {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  async updateSubject(id: string, updates: UpdateSubjectRequest): Promise<SubjectResponse> {
    const response = await api.patch(`/subjects/${id}`, updates);
    return response.data;
  },

  async deleteSubject(id: string): Promise<SubjectResponse> {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  async restoreSubject(id: string): Promise<SubjectResponse> {
    const response = await api.post(`/subjects/${id}/restore`);
    return response.data;
  },

  async permanentlyDeleteSubject(id: string): Promise<SubjectResponse> {
    const response = await api.delete(`/subjects/${id}/permanent`);
    return response.data;
  },

  async getActiveSubjects(): Promise<SubjectResponse> {
    const response = await api.get('/subjects/active');
    return response.data;
  },

  async getSubjectsByProfessor(professorId: string): Promise<SubjectResponse> {
    const response = await api.get(`/subjects/professor/${professorId}`);
    return response.data;
  },

  async assignSubject(subjectId: string, assignmentData: AssignSubjectRequest): Promise<SubjectResponse> {
    const response = await api.post(`/subjects/${subjectId}/assign`, assignmentData);
    return response.data;
  },

  async getAssignedProfessors(subjectId: string): Promise<{ success: boolean; data: { assignments: any[] } }> {
    const response = await api.get(`/subjects/${subjectId}/assignments`);
    return response.data;
  },

  async getSubjectsAssignedToProfessor(professorId: string): Promise<SubjectResponse> {
    const response = await api.get(`/subjects/assigned/${professorId}`);
    return response.data;
  },

  async removeProfessorAssignment(subjectId: string, professorId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/subjects/${subjectId}/assignments/${professorId}`);
    return response.data;
  },
};
