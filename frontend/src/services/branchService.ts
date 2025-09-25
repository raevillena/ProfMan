import api from './api';
import { 
  CreateBranchRequest, 
  UpdateBranchRequest, 
  CloneBranchRequest,
  BranchResponse, 
  Branch 
} from '../types/branch';

export const branchService = {
  async getBranches(params: { 
    page?: number; 
    limit?: number; 
    subjectId?: string;
    professorId?: string;
    isActive?: boolean; 
    search?: string; 
  } = {}): Promise<BranchResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.subjectId) queryParams.append('subjectId', params.subjectId);
    if (params.professorId) queryParams.append('professorId', params.professorId);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await api.get(`/branches?${queryParams.toString()}`);
    return response.data;
  },

  async getBranchById(id: string): Promise<BranchResponse> {
    const response = await api.get(`/branches/${id}`);
    return response.data;
  },

  async createBranch(branchData: CreateBranchRequest): Promise<BranchResponse> {
    const response = await api.post('/branches', branchData);
    return response.data;
  },

  async updateBranch(id: string, updates: UpdateBranchRequest): Promise<BranchResponse> {
    const response = await api.patch(`/branches/${id}`, updates);
    return response.data;
  },

  async deleteBranch(id: string): Promise<BranchResponse> {
    const response = await api.delete(`/branches/${id}`);
    return response.data;
  },

  async restoreBranch(id: string): Promise<BranchResponse> {
    const response = await api.post(`/branches/${id}/restore`);
    return response.data;
  },

  async permanentlyDeleteBranch(id: string): Promise<BranchResponse> {
    const response = await api.delete(`/branches/${id}/permanent`);
    return response.data;
  },

  async getActiveBranches(): Promise<BranchResponse> {
    const response = await api.get('/branches/active');
    return response.data;
  },

  async getBranchesByProfessor(professorId: string): Promise<BranchResponse> {
    const response = await api.get(`/branches/professor/${professorId}`);
    return response.data;
  },

  async getBranchesBySubject(subjectId: string): Promise<BranchResponse> {
    const response = await api.get(`/branches/subject/${subjectId}`);
    return response.data;
  },

  async cloneBranch(id: string, cloneData: CloneBranchRequest): Promise<BranchResponse> {
    const response = await api.post(`/branches/${id}/clone`, cloneData);
    return response.data;
  },
};
