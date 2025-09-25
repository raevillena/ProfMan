export interface User {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'professor' | 'student'
  studentNumber?: string
  isActive: boolean
  isDeleted: boolean
  deletedAt?: string
  googleDrive?: GoogleDriveConfig
  createdAt: string
  updatedAt: string
}

export interface GoogleDriveConfig {
  driveId: string
  accessToken: string
  refreshTokenEncrypted: string
  connectedAt: string
}

export interface CreateUserRequest {
  email: string
  password: string
  displayName: string
  role: 'admin' | 'professor' | 'student'
  studentNumber?: string
}

export interface UpdateUserRequest {
  displayName?: string
  role?: 'admin' | 'professor' | 'student'
  studentNumber?: string
  isActive?: boolean
}

export interface UsersResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  message?: string
}
