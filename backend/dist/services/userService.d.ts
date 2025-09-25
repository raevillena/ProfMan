import { User, CreateUserRequest, UpdateUserRequest } from '../models/User';
export declare class UserService {
    private db;
    getUsers(params: {
        page?: number;
        limit?: number;
        role?: 'admin' | 'professor' | 'student';
        isActive?: boolean;
        search?: string;
    }): Promise<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getUserById(userId: string): Promise<User | null>;
    createUser(userData: CreateUserRequest): Promise<User>;
    updateUser(userId: string, updates: UpdateUserRequest): Promise<User>;
    deleteUser(userId: string): Promise<void>;
    restoreUser(userId: string): Promise<void>;
    permanentlyDeleteUser(userId: string): Promise<void>;
    getUsersByRole(role: 'admin' | 'professor' | 'student'): Promise<User[]>;
    getProfessors(): Promise<User[]>;
    getStudents(): Promise<User[]>;
}
//# sourceMappingURL=userService.d.ts.map