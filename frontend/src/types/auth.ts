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

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  displayName: string
  role: 'admin' | 'professor' | 'student'
  studentNumber?: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  requiresPasswordChange?: boolean
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
