import api from './api'
import { CreateUserRequest, UpdateUserRequest, UsersResponse, ApiResponse, User } from '../types/user'

export const usersService = {
  async getUsers(params: { 
    page?: number
    limit?: number
    role?: string
    includeDeleted?: boolean
  } = {}): Promise<ApiResponse<UsersResponse>> {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post('/admin/users', userData)
    return response.data
  },

  async updateUser(id: string, userData: UpdateUserRequest): Promise<ApiResponse<{ user: User }>> {
    const response = await api.patch(`/admin/users/${id}`, userData)
    return response.data
  },

  async deleteUser(id: string, force = false): Promise<ApiResponse> {
    const response = await api.delete(`/admin/users/${id}?force=${force}`)
    return response.data
  },

  async restoreUser(id: string): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post(`/admin/restore/${id}`)
    return response.data
  },
}
