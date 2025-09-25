import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { getFirestore } from '../utils/firebase';
import { User, CreateUserRequest, LoginRequest, AuthResponse } from '../models/User';
import { initializeFirebase } from '../utils/firebase';

// Initialize Firebase
initializeFirebase();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export class AuthService {
  private db = getFirestore();

  // Generate JWT tokens
  private generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN } as SignOptions);

    return { accessToken, refreshToken };
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Create user
  async createUser(userData: CreateUserRequest): Promise<Omit<User, 'passwordHash'>> {
    const { email, password, displayName, role, studentNumber } = userData;

    // Check if user already exists
    const existingUser = await this.db.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      throw new Error('User with this email already exists');
    }

    // Check if student number is unique for students
    if (role === 'student' && studentNumber) {
      const existingStudent = await this.db
        .collection('users')
        .where('studentNumber', '==', studentNumber)
        .get();
      if (!existingStudent.empty) {
        throw new Error('Student with this number already exists');
      }
    }

    // Hash password
    const passwordHash = password ? await this.hashPassword(password) : undefined;

    // Create user document
    const userRef = this.db.collection('users').doc();
    const now = new Date();
    
    const user: User = {
      id: userRef.id,
      email,
      passwordHash,
      displayName,
      role,
      studentNumber,
      isActive: true,
      isDeleted: false,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    };

    await userRef.set(user);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Student auto-creation
  async autoCreateStudent(email: string, studentNumber: string): Promise<AuthResponse> {
    // Check if student already exists
    const existingUser = await this.db.collection('users').where('email', '==', email).get();
    
    if (!existingUser.empty) {
      const userDoc = existingUser.docs[0];
      if (!userDoc) {
        throw new Error('User document not found');
      }
      const userData = userDoc.data() as User;
      
      // Verify password (student number as password)
      if (userData.passwordHash && await this.verifyPassword(studentNumber, userData.passwordHash)) {
        const tokens = this.generateTokens(userData);
        const { passwordHash: _, ...userWithoutPassword } = userData;
        
        return {
          user: userWithoutPassword,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          requiresPasswordChange: false,
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }

    // Auto-create new student
    const passwordHash = await this.hashPassword(studentNumber);
    const now = new Date();
    
    const userRef = this.db.collection('users').doc();
    const user: User = {
      id: userRef.id,
      email,
      passwordHash,
      displayName: email.split('@')[0] || 'Student', // Use email prefix as display name
      role: 'student',
      studentNumber,
      isActive: true,
      isDeleted: false,
      createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
      updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 } as any,
    };

    await userRef.set(user);

    const tokens = this.generateTokens(user);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      requiresPasswordChange: true, // Force password change on first login
    };
  }

  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Get user by email
    const userQuery = await this.db.collection('users').where('email', '==', email).get();
    
    if (userQuery.empty) {
      throw new Error('Invalid credentials');
    }

    const userDoc = userQuery.docs[0];
    if (!userDoc) {
      throw new Error('Invalid credentials');
    }

    const userData = userDoc.data() as User;
    const userId = userDoc.id;
    userData.id = userId;

    // Check if user is active and not deleted
    if (!userData.isActive || userData.isDeleted) {
      throw new Error('Account is inactive or deleted');
    }

    // Verify password
    if (!userData.passwordHash || !await this.verifyPassword(password, userData.passwordHash)) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.generateTokens(userData);
    const { passwordHash, ...userWithoutPassword } = userData;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      requiresPasswordChange: false,
    };
  }

  // Change password
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const userDoc = await this.db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;

    // Verify old password
    if (!userData.passwordHash || !await this.verifyPassword(oldPassword, userData.passwordHash)) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await this.db.collection('users').doc(userId).update({
      passwordHash: newPasswordHash,
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
    });
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
      
      // Get user from database
      const userDoc = await this.db.collection('users').doc(decoded.userId).get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data() as User;
      if (!userData) {
        throw new Error('User data not found');
      }

      // Check if user is still active
      if (!userData.isActive || userData.isDeleted) {
        throw new Error('Account is inactive or deleted');
      }

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: userData.id, email: userData.email, role: userData.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as SignOptions
      );

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
