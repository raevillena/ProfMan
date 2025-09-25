import { Timestamp } from 'firebase-admin/firestore';
export interface GoogleDriveConfig {
    driveId: string;
    accessToken: string;
    refreshTokenEncrypted: string;
    connectedAt: Timestamp;
}
export interface User {
    id: string;
    email: string;
    passwordHash?: string;
    displayName: string;
    role: 'admin' | 'professor' | 'student';
    studentNumber?: string;
    isActive: boolean;
    isDeleted: boolean;
    deletedAt?: Timestamp;
    googleDrive?: GoogleDriveConfig;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export interface CreateUserRequest {
    email: string;
    password?: string;
    displayName: string;
    role: 'admin' | 'professor' | 'student';
    studentNumber?: string;
}
export interface UpdateUserRequest {
    displayName?: string;
    role?: 'admin' | 'professor' | 'student';
    studentNumber?: string;
    isActive?: boolean;
    password?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
export interface AuthResponse {
    user: Omit<User, 'passwordHash'>;
    accessToken: string;
    refreshToken: string;
    requiresPasswordChange?: boolean;
}
//# sourceMappingURL=User.d.ts.map