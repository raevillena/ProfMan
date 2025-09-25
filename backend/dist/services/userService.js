"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const firebase_1 = require("../utils/firebase");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
    }
    async getUsers(params) {
        const { page = 1, limit = 10, role, isActive, search } = params;
        const offset = (page - 1) * limit;
        let query = this.db.collection('users');
        if (role) {
            query = query.where('role', '==', role);
        }
        if (isActive !== undefined) {
            query = query.where('isActive', '==', isActive);
        }
        const totalSnapshot = await query.get();
        const total = totalSnapshot.size;
        query = query.limit(limit).offset(offset);
        const snapshot = await query.get();
        const users = [];
        snapshot.forEach((doc) => {
            const userData = doc.data();
            userData.id = doc.id;
            users.push(userData);
        });
        let filteredUsers = users;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = users.filter(user => user.email.toLowerCase().includes(searchLower) ||
                user.displayName.toLowerCase().includes(searchLower) ||
                (user.studentNumber && user.studentNumber.toLowerCase().includes(searchLower)));
        }
        return {
            users: filteredUsers,
            total: filteredUsers.length,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getUserById(userId) {
        const doc = await this.db.collection('users').doc(userId).get();
        if (!doc.exists) {
            return null;
        }
        const userData = doc.data();
        userData.id = doc.id;
        return userData;
    }
    async createUser(userData) {
        const { email, password, displayName, role, studentNumber } = userData;
        const existingUser = await this.db.collection('users').where('email', '==', email).get();
        if (!existingUser.empty) {
            throw new Error('User with this email already exists');
        }
        let passwordHash;
        if (password) {
            passwordHash = await bcryptjs_1.default.hash(password, 12);
        }
        const now = new Date();
        const userRef = this.db.collection('users').doc();
        const firestoreUserData = {
            id: userRef.id,
            email,
            displayName,
            role,
            isActive: true,
            isDeleted: false,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        if (passwordHash) {
            firestoreUserData.passwordHash = passwordHash;
        }
        if (studentNumber) {
            firestoreUserData.studentNumber = studentNumber;
        }
        await userRef.set(firestoreUserData);
        return firestoreUserData;
    }
    async updateUser(userId, updates) {
        const userRef = this.db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        const updateData = {
            ...updates,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        };
        if (updates.password) {
            updateData.passwordHash = await bcryptjs_1.default.hash(updates.password, 12);
            delete updateData.password;
        }
        await userRef.update(updateData);
        const updatedUser = await this.getUserById(userId);
        if (!updatedUser) {
            throw new Error('Failed to retrieve updated user');
        }
        return updatedUser;
    }
    async deleteUser(userId) {
        const userRef = this.db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        await userRef.update({
            isDeleted: true,
            deletedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        });
    }
    async restoreUser(userId) {
        const userRef = this.db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        await userRef.update({
            isDeleted: false,
            deletedAt: null,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        });
    }
    async permanentlyDeleteUser(userId) {
        const userRef = this.db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        await userRef.delete();
    }
    async getUsersByRole(role) {
        const snapshot = await this.db.collection('users')
            .where('role', '==', role)
            .where('isDeleted', '==', false)
            .get();
        const users = [];
        snapshot.forEach((doc) => {
            const userData = doc.data();
            userData.id = doc.id;
            users.push(userData);
        });
        return users;
    }
    async getProfessors() {
        return this.getUsersByRole('professor');
    }
    async getStudents() {
        return this.getUsersByRole('student');
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map