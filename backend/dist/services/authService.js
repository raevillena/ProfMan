"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firebase_1 = require("../utils/firebase");
const firebase_2 = require("../utils/firebase");
(0, firebase_2.initializeFirebase)();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
class AuthService {
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
    }
    generateTokens(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
        return { accessToken, refreshToken };
    }
    async hashPassword(password) {
        const saltRounds = 12;
        return bcryptjs_1.default.hash(password, saltRounds);
    }
    async verifyPassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    async createUser(userData) {
        const { email, password, displayName, role, studentNumber } = userData;
        const existingUser = await this.db.collection('users').where('email', '==', email).get();
        if (!existingUser.empty) {
            throw new Error('User with this email already exists');
        }
        if (role === 'student' && studentNumber) {
            const existingStudent = await this.db
                .collection('users')
                .where('studentNumber', '==', studentNumber)
                .get();
            if (!existingStudent.empty) {
                throw new Error('Student with this number already exists');
            }
        }
        const passwordHash = password ? await this.hashPassword(password) : undefined;
        const userRef = this.db.collection('users').doc();
        const now = new Date();
        const user = {
            id: userRef.id,
            email,
            passwordHash,
            displayName,
            role,
            studentNumber,
            isActive: true,
            isDeleted: false,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await userRef.set(user);
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async autoCreateStudent(email, studentNumber) {
        const existingUser = await this.db.collection('users').where('email', '==', email).get();
        if (!existingUser.empty) {
            const userDoc = existingUser.docs[0];
            if (!userDoc) {
                throw new Error('User document not found');
            }
            const userData = userDoc.data();
            if (userData.passwordHash && await this.verifyPassword(studentNumber, userData.passwordHash)) {
                const tokens = this.generateTokens(userData);
                const { passwordHash: _, ...userWithoutPassword } = userData;
                return {
                    user: userWithoutPassword,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    requiresPasswordChange: false,
                };
            }
            else {
                throw new Error('Invalid credentials');
            }
        }
        const passwordHash = await this.hashPassword(studentNumber);
        const now = new Date();
        const userRef = this.db.collection('users').doc();
        const user = {
            id: userRef.id,
            email,
            passwordHash,
            displayName: email.split('@')[0] || 'Student',
            role: 'student',
            studentNumber,
            isActive: true,
            isDeleted: false,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await userRef.set(user);
        const tokens = this.generateTokens(user);
        const { passwordHash: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            requiresPasswordChange: true,
        };
    }
    async login(credentials) {
        const { email, password } = credentials;
        const userQuery = await this.db.collection('users').where('email', '==', email).get();
        if (userQuery.empty) {
            throw new Error('Invalid credentials');
        }
        const userDoc = userQuery.docs[0];
        if (!userDoc) {
            throw new Error('Invalid credentials');
        }
        const userData = userDoc.data();
        const userId = userDoc.id;
        userData.id = userId;
        if (!userData.isActive || userData.isDeleted) {
            throw new Error('Account is inactive or deleted');
        }
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
    async changePassword(userId, oldPassword, newPassword) {
        const userDoc = await this.db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        const userData = userDoc.data();
        if (!userData.passwordHash || !await this.verifyPassword(oldPassword, userData.passwordHash)) {
            throw new Error('Current password is incorrect');
        }
        const newPasswordHash = await this.hashPassword(newPassword);
        await this.db.collection('users').doc(userId).update({
            passwordHash: newPasswordHash,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        });
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
            const userDoc = await this.db.collection('users').doc(decoded.userId).get();
            if (!userDoc.exists) {
                throw new Error('User not found');
            }
            const userData = userDoc.data();
            if (!userData) {
                throw new Error('User data not found');
            }
            if (!userData.isActive || userData.isDeleted) {
                throw new Error('Account is inactive or deleted');
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: userData.id, email: userData.email, role: userData.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            return { accessToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map