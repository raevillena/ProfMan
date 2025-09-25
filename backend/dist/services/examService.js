"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamService = void 0;
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase-admin/firestore");
const googleDriveService_1 = require("./googleDriveService");
class ExamService {
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
        this.googleDriveService = new googleDriveService_1.GoogleDriveService();
    }
    async createExam(examData, professorId) {
        const now = new Date();
        const examRef = this.db.collection('exams').doc();
        const exam = {
            id: examRef.id,
            branchId: examData.branchId,
            professorId,
            title: examData.title,
            description: examData.description,
            instructions: examData.instructions,
            totalPoints: examData.totalPoints,
            timeLimit: examData.timeLimit,
            dueDate: firestore_1.Timestamp.fromDate(new Date(examData.dueDate)),
            isActive: true,
            allowLateSubmission: examData.allowLateSubmission,
            maxAttempts: examData.maxAttempts,
            questions: examData.questions.map((q, index) => ({
                ...q,
                id: `q${index + 1}`
            })),
            createdAt: firestore_1.Timestamp.fromDate(now),
            updatedAt: firestore_1.Timestamp.fromDate(now)
        };
        await examRef.set(exam);
        return exam;
    }
    async getExamById(examId) {
        const examDoc = await this.db.collection('exams').doc(examId).get();
        if (!examDoc.exists) {
            return null;
        }
        return examDoc.data();
    }
    async getExamsByBranch(branchId, isActive) {
        let query = this.db.collection('exams').where('branchId', '==', branchId);
        if (isActive !== undefined) {
            query = query.where('isActive', '==', isActive);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => doc.data());
    }
    async getExamsByProfessor(professorId, isActive) {
        let query = this.db.collection('exams').where('professorId', '==', professorId);
        if (isActive !== undefined) {
            query = query.where('isActive', '==', isActive);
        }
        const snapshot = await query.orderBy('createdAt', 'desc').get();
        return snapshot.docs.map(doc => doc.data());
    }
    async updateExam(examId, updateData) {
        const examRef = this.db.collection('exams').doc(examId);
        const examDoc = await examRef.get();
        if (!examDoc.exists) {
            throw new Error('Exam not found');
        }
        const currentExam = examDoc.data();
        const now = new Date();
        const updatedExam = {
            ...updateData,
            updatedAt: firestore_1.Timestamp.fromDate(now)
        };
        if (updateData.questions) {
            updatedExam.questions = updateData.questions.map((q, index) => ({
                ...q,
                id: q.id || `q${index + 1}`
            }));
        }
        if (updateData.dueDate) {
            updatedExam.dueDate = firestore_1.Timestamp.fromDate(new Date(updateData.dueDate));
        }
        await examRef.update(updatedExam);
        return { ...currentExam, ...updatedExam };
    }
    async deleteExam(examId) {
        const examRef = this.db.collection('exams').doc(examId);
        await examRef.update({
            isActive: false,
            updatedAt: firestore_1.Timestamp.fromDate(new Date())
        });
    }
    async submitExam(examId, studentId, studentName, submissionData) {
        const exam = await this.getExamById(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }
        if (!exam.isActive) {
            throw new Error('Exam is not active');
        }
        const now = new Date();
        const dueDate = exam.dueDate.toDate();
        const isLate = now > dueDate && !exam.allowLateSubmission;
        if (isLate) {
            throw new Error('Exam submission deadline has passed');
        }
        if (exam.maxAttempts) {
            const existingSubmissions = await this.getExamSubmissions(examId, studentId);
            if (existingSubmissions.length >= exam.maxAttempts) {
                throw new Error('Maximum attempts reached');
            }
        }
        let totalEarnedPoints = 0;
        const gradedAnswers = submissionData.answers.map(answer => {
            const question = exam.questions.find(q => q.id === answer.questionId);
            if (!question)
                return answer;
            let points = 0;
            if (question.type === 'multiple_choice' || question.type === 'true_false') {
                if (question.correctAnswer && answer.answer === question.correctAnswer) {
                    points = question.points;
                    totalEarnedPoints += points;
                }
            }
            return {
                ...answer,
                points
            };
        });
        const percentage = (totalEarnedPoints / exam.totalPoints) * 100;
        const grade = this.calculateGrade(percentage);
        const submission = {
            id: this.db.collection('examSubmissions').doc().id,
            examId,
            studentId,
            studentName,
            answers: gradedAnswers,
            totalPoints: exam.totalPoints,
            earnedPoints: totalEarnedPoints,
            percentage,
            grade,
            submittedAt: firestore_1.Timestamp.fromDate(now),
            isLate: now > dueDate,
            attemptNumber: await this.getNextAttemptNumber(examId, studentId),
            status: 'submitted'
        };
        await this.db.collection('examSubmissions').doc(submission.id).set(submission);
        return submission;
    }
    async getExamSubmissions(examId, studentId) {
        let query = this.db.collection('examSubmissions').where('examId', '==', examId);
        if (studentId) {
            query = query.where('studentId', '==', studentId);
        }
        const snapshot = await query.orderBy('submittedAt', 'desc').get();
        return snapshot.docs.map(doc => doc.data());
    }
    async gradeExamSubmission(submissionId, gradeData, gradedBy) {
        const submissionRef = this.db.collection('examSubmissions').doc(submissionId);
        const submissionDoc = await submissionRef.get();
        if (!submissionDoc.exists) {
            throw new Error('Submission not found');
        }
        const submission = submissionDoc.data();
        const now = new Date();
        const updatedAnswers = submission.answers.map(answer => {
            const gradeInfo = gradeData.answers.find(g => g.questionId === answer.questionId);
            if (gradeInfo) {
                return {
                    ...answer,
                    points: gradeInfo.points,
                    feedback: gradeInfo.feedback
                };
            }
            return answer;
        });
        const totalEarnedPoints = updatedAnswers.reduce((sum, answer) => sum + (answer.points || 0), 0);
        const percentage = (totalEarnedPoints / submission.totalPoints) * 100;
        const grade = this.calculateGrade(percentage);
        const updatedSubmission = {
            ...submission,
            answers: updatedAnswers,
            earnedPoints: totalEarnedPoints,
            percentage,
            grade,
            status: 'graded',
            feedback: gradeData.overallFeedback,
            gradedBy,
            gradedAt: firestore_1.Timestamp.fromDate(now)
        };
        await submissionRef.update(updatedSubmission);
        return updatedSubmission;
    }
    async uploadExamFile(userId, fileBuffer, fileName, mimeType) {
        try {
            const folderResult = await this.googleDriveService.createFolder(userId, 'Exam Files');
            if (!folderResult.success) {
                throw new Error('Failed to create exam files folder');
            }
            const uploadResult = await this.googleDriveService.uploadFile(userId, fileBuffer, fileName, mimeType, folderResult.folderId);
            return uploadResult;
        }
        catch (error) {
            console.error('Error uploading exam file:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'File upload failed'
            };
        }
    }
    calculateGrade(percentage) {
        if (percentage >= 97)
            return 'A+';
        if (percentage >= 93)
            return 'A';
        if (percentage >= 90)
            return 'A-';
        if (percentage >= 87)
            return 'B+';
        if (percentage >= 83)
            return 'B';
        if (percentage >= 80)
            return 'B-';
        if (percentage >= 77)
            return 'C+';
        if (percentage >= 73)
            return 'C';
        if (percentage >= 70)
            return 'C-';
        if (percentage >= 67)
            return 'D+';
        if (percentage >= 63)
            return 'D';
        if (percentage >= 60)
            return 'D-';
        return 'F';
    }
    async getNextAttemptNumber(examId, studentId) {
        const submissions = await this.getExamSubmissions(examId, studentId);
        return submissions.length + 1;
    }
}
exports.ExamService = ExamService;
//# sourceMappingURL=examService.js.map