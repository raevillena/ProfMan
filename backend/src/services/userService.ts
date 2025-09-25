import { getFirestore } from '../utils/firebase';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserService {
  private db = getFirestore();

  // Get all users with pagination and filtering
  async getUsers(params: {
    page?: number;
    limit?: number;
    role?: 'admin' | 'professor' | 'student';
    isActive?: boolean;
    search?: string;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, role, isActive, search } = params;
    const offset = (page - 1) * limit;

    let query: any = this.db.collection('users');

    // Apply filters
    if (role) {
      query = query.where('role', '==', role);
    }
    if (isActive !== undefined) {
      query = query.where('isActive', '==', isActive);
    }

    // Get total count
    const totalSnapshot = await query.get();
    const total = totalSnapshot.size;

    // Apply pagination
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    const users: User[] = [];

    snapshot.forEach((doc: any) => {
      const userData = doc.data() as User;
      userData.id = doc.id;
      users.push(userData);
    });

    // Apply search filter if provided
    let filteredUsers = users;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        user.displayName.toLowerCase().includes(searchLower) ||
        (user.studentNumber && user.studentNumber.toLowerCase().includes(searchLower))
      );
    }

    return {
      users: filteredUsers,
      total: filteredUsers.length,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const doc = await this.db.collection('users').doc(userId).get();
    
    if (!doc.exists) {
      return null;
    }

    const userData = doc.data() as User;
    userData.id = doc.id;
    return userData;
  }

  // Create new user (admin only)
  async createUser(userData: CreateUserRequest): Promise<User> {
    const { email, password, displayName, role, studentNumber } = userData;

    // Check if user already exists
    const existingUser = await this.db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      throw new Error('User with this email already exists');
    }

    // Hash password if provided
    let passwordHash: string | undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, 12);
    }

    const now = new Date();
    const userRef = this.db.collection('users').doc();

    const firestoreUserData: any = {
      id: userRef.id,
      email,
      displayName,
      role,
      isActive: true,
      isDeleted: false,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    };

    // Only add fields that are not undefined
    if (passwordHash) {
      firestoreUserData.passwordHash = passwordHash;
    }
    if (studentNumber) {
      firestoreUserData.studentNumber = studentNumber;
    }

    await userRef.set(firestoreUserData);
    return firestoreUserData as User;
  }

  // Update user (admin only)
  async updateUser(userId: string, updates: UpdateUserRequest): Promise<User> {
    const userRef = this.db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const updateData: Partial<User> = {
      ...updates,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    };

    // Hash password if provided
    if (updates.password) {
      updateData.passwordHash = await bcrypt.hash(updates.password, 12);
      delete (updateData as any).password;
    }

    await userRef.update(updateData);

    const updatedUser = await this.getUserById(userId);
    if (!updatedUser) {
      throw new Error('Failed to retrieve updated user');
    }

    return updatedUser;
  }

  // Soft delete user (admin only)
  async deleteUser(userId: string): Promise<void> {
    const userRef = this.db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    await userRef.update({
      isDeleted: true,
      deletedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    });
  }

  // Restore user (admin only)
  async restoreUser(userId: string): Promise<void> {
    const userRef = this.db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    await userRef.update({
      isDeleted: false,
      deletedAt: null,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    });
  }

  // Permanently delete user (admin only)
  async permanentlyDeleteUser(userId: string): Promise<void> {
    const userRef = this.db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    await userRef.delete();
  }

  // Get users by role
  async getUsersByRole(role: 'admin' | 'professor' | 'student'): Promise<User[]> {
    const snapshot = await this.db.collection('users')
      .where('role', '==', role)
      .where('isDeleted', '==', false)
      .get();

    const users: User[] = [];
    snapshot.forEach((doc: any) => {
      const userData = doc.data() as User;
      userData.id = doc.id;
      users.push(userData);
    });

    return users;
  }

  // Get professors for subject assignment
  async getProfessors(): Promise<User[]> {
    return this.getUsersByRole('professor');
  }

  // Get students for class enrollment
  async getStudents(): Promise<User[]> {
    return this.getUsersByRole('student');
  }
}
