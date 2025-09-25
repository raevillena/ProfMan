"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase-admin/firestore");
class SubjectService {
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
    }
    async getSubjects(params) {
        const { page = 1, limit = 10, isActive, search } = params;
        const offset = (page - 1) * limit;
        let query = this.db.collection('subjects');
        if (isActive !== undefined) {
            query = query.where('isActive', '==', isActive);
        }
        const totalSnapshot = await query.get();
        const total = totalSnapshot.size;
        query = query.limit(limit).offset(offset);
        const snapshot = await query.get();
        const subjects = [];
        snapshot.forEach((doc) => {
            const subjectData = doc.data();
            subjectData.id = doc.id;
            subjects.push(subjectData);
        });
        let filteredSubjects = subjects;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredSubjects = subjects.filter(subject => subject.code.toLowerCase().includes(searchLower) ||
                subject.title.toLowerCase().includes(searchLower) ||
                subject.description.toLowerCase().includes(searchLower));
        }
        return {
            subjects: filteredSubjects,
            total: filteredSubjects.length,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getSubjectById(subjectId) {
        const doc = await this.db.collection('subjects').doc(subjectId).get();
        if (!doc.exists) {
            return null;
        }
        const subjectData = doc.data();
        subjectData.id = doc.id;
        return subjectData;
    }
    async getSubjectByCode(code) {
        const query = await this.db.collection('subjects').where('code', '==', code).get();
        if (query.empty) {
            return null;
        }
        const doc = query.docs[0];
        if (!doc) {
            return null;
        }
        const subjectData = doc.data();
        subjectData.id = doc.id;
        return subjectData;
    }
    async createSubject(subjectData, createdBy) {
        const { code, title, description, credits } = subjectData;
        const existingSubject = await this.getSubjectByCode(code);
        if (existingSubject) {
            throw new Error('Subject with this code already exists');
        }
        const now = new Date();
        const subjectRef = this.db.collection('subjects').doc();
        const subject = {
            id: subjectRef.id,
            code,
            title,
            description,
            credits,
            isActive: true,
            assignedProfessors: [],
            createdBy: createdBy,
            createdAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
            updatedAt: { seconds: Math.floor(now.getTime() / 1000), nanoseconds: 0 },
        };
        await subjectRef.set(subject);
        return subject;
    }
    async updateSubject(subjectId, updates) {
        const subjectRef = this.db.collection('subjects').doc(subjectId);
        const subjectDoc = await subjectRef.get();
        if (!subjectDoc.exists) {
            throw new Error('Subject not found');
        }
        if (updates.code) {
            const existingSubject = await this.getSubjectByCode(updates.code);
            if (existingSubject && existingSubject.id !== subjectId) {
                throw new Error('Subject with this code already exists');
            }
        }
        const updateData = {
            ...updates,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        };
        await subjectRef.update(updateData);
        const updatedSubject = await this.getSubjectById(subjectId);
        if (!updatedSubject) {
            throw new Error('Failed to retrieve updated subject');
        }
        return updatedSubject;
    }
    async deleteSubject(subjectId) {
        const subjectRef = this.db.collection('subjects').doc(subjectId);
        const subjectDoc = await subjectRef.get();
        if (!subjectDoc.exists) {
            throw new Error('Subject not found');
        }
        await subjectRef.update({
            isActive: false,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        });
    }
    async restoreSubject(subjectId) {
        const subjectRef = this.db.collection('subjects').doc(subjectId);
        const subjectDoc = await subjectRef.get();
        if (!subjectDoc.exists) {
            throw new Error('Subject not found');
        }
        await subjectRef.update({
            isActive: true,
            updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        });
    }
    async permanentlyDeleteSubject(subjectId) {
        const subjectRef = this.db.collection('subjects').doc(subjectId);
        const subjectDoc = await subjectRef.get();
        if (!subjectDoc.exists) {
            throw new Error('Subject not found');
        }
        await subjectRef.delete();
    }
    async getActiveSubjects() {
        const snapshot = await this.db.collection('subjects')
            .where('isActive', '==', true)
            .get();
        const subjects = [];
        snapshot.forEach((doc) => {
            const subjectData = doc.data();
            subjectData.id = doc.id;
            subjects.push(subjectData);
        });
        return subjects;
    }
    async getSubjectsByProfessor(professorId) {
        const branchesSnapshot = await this.db.collection('branches')
            .where('professorId', '==', professorId)
            .where('isActive', '==', true)
            .get();
        if (branchesSnapshot.empty) {
            return [];
        }
        const subjectIds = [...new Set(branchesSnapshot.docs.map(doc => doc.data().subjectId))];
        const subjects = [];
        for (const subjectId of subjectIds) {
            const subject = await this.getSubjectById(subjectId);
            if (subject && subject.isActive) {
                subjects.push(subject);
            }
        }
        return subjects;
    }
    async assignSubjectToProfessors(subjectId, assignmentData, assignedBy) {
        const subjectRef = this.db.collection('subjects').doc(subjectId);
        const subjectDoc = await subjectRef.get();
        if (!subjectDoc.exists) {
            throw new Error('Subject not found');
        }
        const now = new Date();
        const currentSubject = subjectDoc.data();
        const updatedSubject = {
            ...currentSubject,
            assignedProfessors: assignmentData.professorIds,
            updatedAt: firestore_1.Timestamp.fromDate(now),
        };
        await subjectRef.update(updatedSubject);
        const batch = this.db.batch();
        for (const professorId of assignmentData.professorIds) {
            const assignmentRef = this.db.collection('subjectAssignments').doc();
            const assignment = {
                subjectId,
                professorId,
                assignedAt: firestore_1.Timestamp.fromDate(now),
                assignedBy,
            };
            batch.set(assignmentRef, assignment);
        }
        await batch.commit();
        return { ...updatedSubject, id: subjectId };
    }
    async getAssignedProfessors(subjectId) {
        const assignmentsSnapshot = await this.db.collection('subjectAssignments')
            .where('subjectId', '==', subjectId)
            .orderBy('assignedAt', 'desc')
            .get();
        const assignments = [];
        assignmentsSnapshot.forEach((doc) => {
            const data = doc.data();
            assignments.push({
                professorId: data.professorId,
                assignedAt: data.assignedAt,
                assignedBy: data.assignedBy,
            });
        });
        return assignments;
    }
    async getSubjectsAssignedToProfessor(professorId) {
        const assignmentsSnapshot = await this.db.collection('subjectAssignments')
            .where('professorId', '==', professorId)
            .get();
        const subjectIds = assignmentsSnapshot.docs.map(doc => doc.data().subjectId);
        const subjects = [];
        for (const subjectId of subjectIds) {
            const subject = await this.getSubjectById(subjectId);
            if (subject && subject.isActive) {
                subjects.push(subject);
            }
        }
        return subjects;
    }
    async removeProfessorAssignment(subjectId, professorId) {
        const subjectRef = this.db.collection('subjects').doc(subjectId);
        const subjectDoc = await subjectRef.get();
        if (!subjectDoc.exists) {
            throw new Error('Subject not found');
        }
        const currentSubject = subjectDoc.data();
        const updatedProfessors = currentSubject.assignedProfessors.filter(id => id !== professorId);
        await subjectRef.update({
            assignedProfessors: updatedProfessors,
            updatedAt: firestore_1.Timestamp.fromDate(new Date()),
        });
        const assignmentQuery = await this.db.collection('subjectAssignments')
            .where('subjectId', '==', subjectId)
            .where('professorId', '==', professorId)
            .get();
        const batch = this.db.batch();
        assignmentQuery.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
}
exports.SubjectService = SubjectService;
//# sourceMappingURL=subjectService.js.map