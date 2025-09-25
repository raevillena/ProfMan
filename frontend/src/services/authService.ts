import axios from 'axios'
import { LoginRequest, RegisterRequest, ChangePasswordRequest, AuthResponse, ApiResponse, User } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken })
          const { accessToken } = response.data.data

          // Update tokens in localStorage
          localStorage.setItem('accessToken', accessToken)
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`

          // Retry the original request
          return api(originalRequest)
        } else {
          // No refresh token, redirect to login
          authService.logout()
          window.location.href = '/login'
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        console.error('Token refresh failed:', refreshError)
        authService.logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse> {
    const response = await api.post('/auth/change-password', passwordData)
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get('/auth/me')
    return response.data
  },

  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },

  // User persistence methods
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
        return null
      }
    }
    return null
  },

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken')
    }
  },

  isAuthenticated(): boolean {
    const { accessToken, refreshToken } = this.getTokens()
    return !!(accessToken && refreshToken)
  },

  // Initialize auth state from localStorage
  async initializeAuth(): Promise<{ user: User | null; isAuthenticated: boolean }> {
    if (!this.isAuthenticated()) {
      return { user: null, isAuthenticated: false }
    }

    try {
      // Try to get current user from API
      const response = await this.getCurrentUser()
      if (response.success && response.data?.user) {
        this.saveUser(response.data.user)
        return { user: response.data.user, isAuthenticated: true }
      }
    } catch (error) {
      console.error('Error initializing auth:', error)
      // If API call fails, try to use cached user
      const cachedUser = this.getUser()
      if (cachedUser) {
        return { user: cachedUser, isAuthenticated: true }
      }
    }

    // If all else fails, clear auth state
    this.logout()
    return { user: null, isAuthenticated: false }
  },
}

export default api
