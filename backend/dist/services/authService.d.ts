import { User, CreateUserRequest, LoginRequest, AuthResponse } from '../models/User';
export declare class AuthService {
    private db;
    private generateTokens;
    private hashPassword;
    private verifyPassword;
    createUser(userData: CreateUserRequest): Promise<Omit<User, 'passwordHash'>>;
    autoCreateStudent(email: string, studentNumber: string): Promise<AuthResponse>;
    login(credentials: LoginRequest): Promise<AuthResponse>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=authService.d.ts.map