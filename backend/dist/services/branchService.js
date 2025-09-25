"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchService = void 0;
const firebase_1 = require("../utils/firebase");
class BranchService {
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
    }
    async getBranches(params) {
        const { page = 1, limit = 10, subjectId, professorId, isActive, search } = params;
        const offset = (page - 1) * limit;
        let query = this.db.collection('branches');
        if (subjectId) {
            query = query.where('subjectId', '==', subjectId);
        }
        if (professorId) {
            query = query.where('professorId', '==', professorId);
        }
        if (isActive !== undefined) {
            query = query.where('isActive', '==', isActive);
        }
        const totalSnapshot = await query.get();
        const total = totalSnapshot.size;
        query = query.limit(limit).offset(offset);
        const snapshot = await query.get();
        const branches = [];
        snapshot.forEach((doc) => {
            const branchData = doc.data();
            branchData.id = doc.id;
            branches.push(branchData);
        });
        let filteredBranches = branches;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredBranches = branches.filter(branch => branch.title.toLowerCase().includes(searchLower) ||
                branch.description.toLowerCase().includes(searchLower));
        }
        return {
            branches: filteredBranches,
            total: filteredBranches.length,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getBranchById(branchId) {
        const doc = await this.db.collection('branches').doc(branchId).get();
        if (!doc.exists) {
            return null;
        }
        const branchData = doc.data();
        branchData.id = doc.id;
        return branchData;
    }
    async createBranch(branchData) {
        const { subjectId, professorId, title, description, weekStructure } = branchData;
        const subjectDoc = await this.db.collection('subjects').doc(subjectId).get();
        if (!subjectDoc.exists) {
            throw new Error('Subject not found');
        }
        const professorDoc = await this.db.collection('users').doc(professorId).get();
        if (!professorDoc.exists) {
            throw new Error('Professor not found');
        }
        const professorData = professorDoc.data();
        if (professorData?.role !== 'professor') {
            throw new Error('User is not a professor');
        }
        const now = new Date();
        const branchRef = this.db.collection('branches').doc();
        const branch = {
            id: branchRef.id,
            subjectId,
            professorId,
            title,
            description,
            weekStructure: weekStructure || [],
            isActive: true,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await branchRef.set(branch);
        return branch;
    }
    async updateBranch(branchId, updates) {
        const branchRef = this.db.collection('branches').doc(branchId);
        const branchDoc = await branchRef.get();
        if (!branchDoc.exists) {
            throw new Error('Branch not found');
        }
        const updateData = {
            ...updates,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        };
        await branchRef.update(updateData);
        const updatedBranch = await this.getBranchById(branchId);
        if (!updatedBranch) {
            throw new Error('Failed to retrieve updated branch');
        }
        return updatedBranch;
    }
    async deleteBranch(branchId) {
        const branchRef = this.db.collection('branches').doc(branchId);
        const branchDoc = await branchRef.get();
        if (!branchDoc.exists) {
            throw new Error('Branch not found');
        }
        await branchRef.update({
            isActive: false,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        });
    }
    async restoreBranch(branchId) {
        const branchRef = this.db.collection('branches').doc(branchId);
        const branchDoc = await branchRef.get();
        if (!branchDoc.exists) {
            throw new Error('Branch not found');
        }
        await branchRef.update({
            isActive: true,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        });
    }
    async permanentlyDeleteBranch(branchId) {
        const branchRef = this.db.collection('branches').doc(branchId);
        const branchDoc = await branchRef.get();
        if (!branchDoc.exists) {
            throw new Error('Branch not found');
        }
        await branchRef.delete();
    }
    async getBranchesByProfessor(professorId) {
        const snapshot = await this.db.collection('branches')
            .where('professorId', '==', professorId)
            .where('isActive', '==', true)
            .get();
        const branches = [];
        snapshot.forEach((doc) => {
            const branchData = doc.data();
            branchData.id = doc.id;
            branches.push(branchData);
        });
        return branches;
    }
    async getBranchesBySubject(subjectId) {
        const snapshot = await this.db.collection('branches')
            .where('subjectId', '==', subjectId)
            .where('isActive', '==', true)
            .get();
        const branches = [];
        snapshot.forEach((doc) => {
            const branchData = doc.data();
            branchData.id = doc.id;
            branches.push(branchData);
        });
        return branches;
    }
    async getActiveBranches() {
        const snapshot = await this.db.collection('branches')
            .where('isActive', '==', true)
            .get();
        const branches = [];
        snapshot.forEach((doc) => {
            const branchData = doc.data();
            branchData.id = doc.id;
            branches.push(branchData);
        });
        return branches;
    }
    async cloneBranch(branchId, newProfessorId, newTitle) {
        const originalBranch = await this.getBranchById(branchId);
        if (!originalBranch) {
            throw new Error('Original branch not found');
        }
        const professorDoc = await this.db.collection('users').doc(newProfessorId).get();
        if (!professorDoc.exists) {
            throw new Error('Professor not found');
        }
        const professorData = professorDoc.data();
        if (professorData?.role !== 'professor') {
            throw new Error('User is not a professor');
        }
        const now = new Date();
        const branchRef = this.db.collection('branches').doc();
        const newBranch = {
            id: branchRef.id,
            subjectId: originalBranch.subjectId,
            professorId: newProfessorId,
            title: newTitle,
            description: originalBranch.description,
            weekStructure: originalBranch.weekStructure,
            isActive: true,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await branchRef.set(newBranch);
        return newBranch;
    }
}
exports.BranchService = BranchService;
//# sourceMappingURL=branchService.js.map