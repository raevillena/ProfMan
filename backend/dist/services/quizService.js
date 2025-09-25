"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase-admin/firestore");
const uuid_1 = require("uuid");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class QuizService {
    constructor() {
        this.db = (0, firebase_1.getFirestore)();
    }
    async getQuizzes(params) {
        const { page = 1, limit = 10, search, isActive, isDeleted, branchId } = params;
        const offset = (page - 1) * limit;
        let query = this.db.collection('quizzes');
        if (isActive !== undefined) {
            query = query.where('isActive', '==', isActive);
        }
        if (isDeleted !== undefined) {
            query = query.where('isDeleted', '==', isDeleted);
        }
        if (branchId) {
            query = query.where('branchId', '==', branchId);
        }
        const totalSnapshot = await query.get();
        const total = totalSnapshot.size;
        query = query.limit(limit).offset(offset);
        const snapshot = await query.get();
        let quizzes = [];
        snapshot.forEach((doc) => {
            const quizData = doc.data();
            quizData.id = doc.id;
            quizzes.push(quizData);
        });
        if (search) {
            const searchLower = search.toLowerCase();
            quizzes = quizzes.filter((q) => q.title.toLowerCase().includes(searchLower) ||
                q.description?.toLowerCase().includes(searchLower));
        }
        const totalPages = Math.ceil(total / limit);
        return { quizzes, total, page, totalPages };
    }
    async getQuizById(id) {
        const quizDoc = await this.db.collection('quizzes').doc(id).get();
        if (!quizDoc.exists) {
            return null;
        }
        const quizData = quizDoc.data();
        quizData.id = quizDoc.id;
        return quizData;
    }
    async createQuiz(quizData) {
        const quizRef = this.db.collection('quizzes').doc();
        const now = new Date();
        const questionsWithIds = quizData.questions.map(question => ({
            ...question,
            id: (0, uuid_1.v4)()
        }));
        const totalPoints = questionsWithIds.reduce((sum, question) => sum + question.points, 0);
        const newQuiz = {
            id: quizRef.id,
            ...quizData,
            questions: questionsWithIds,
            totalPoints,
            isActive: true,
            isDeleted: false,
            createdAt: firestore_1.Timestamp.fromDate(now),
            updatedAt: firestore_1.Timestamp.fromDate(now),
        };
        await quizRef.set(newQuiz);
        return newQuiz;
    }
    async updateQuiz(id, updates) {
        const quizRef = this.db.collection('quizzes').doc(id);
        const quizDoc = await quizRef.get();
        if (!quizDoc.exists) {
            return null;
        }
        const now = new Date();
        const updateData = {
            ...updates,
            updatedAt: firestore_1.Timestamp.fromDate(now),
        };
        if (updates.questions) {
            const questionsWithIds = updates.questions.map(question => ({
                ...question,
                id: (0, uuid_1.v4)()
            }));
            updateData.questions = questionsWithIds;
            updateData.totalPoints = questionsWithIds.reduce((sum, question) => sum + question.points, 0);
        }
        await quizRef.update(updateData);
        const updatedDoc = await quizRef.get();
        const updatedQuiz = updatedDoc.data();
        updatedQuiz.id = updatedDoc.id;
        return updatedQuiz;
    }
    async deleteQuiz(id) {
        const quizRef = this.db.collection('quizzes').doc(id);
        const now = new Date();
        await quizRef.update({
            isDeleted: true,
            deletedAt: firestore_1.Timestamp.fromDate(now),
            isActive: false,
            updatedAt: firestore_1.Timestamp.fromDate(now),
        });
    }
    async restoreQuiz(id) {
        const quizRef = this.db.collection('quizzes').doc(id);
        const now = new Date();
        await quizRef.update({
            isDeleted: false,
            deletedAt: firebase_admin_1.default.firestore.FieldValue.delete(),
            isActive: true,
            updatedAt: firestore_1.Timestamp.fromDate(now),
        });
    }
    async permanentlyDeleteQuiz(id) {
        await this.db.collection('quizzes').doc(id).delete();
    }
    async getQuizzesByBranch(branchId) {
        const snapshot = await this.db.collection('quizzes')
            .where('branchId', '==', branchId)
            .where('isActive', '==', true)
            .where('isDeleted', '==', false)
            .get();
        const quizzes = [];
        snapshot.forEach((doc) => {
            const quizData = doc.data();
            quizData.id = doc.id;
            quizzes.push(quizData);
        });
        return quizzes;
    }
    async submitQuizAttempt(attemptData, studentId) {
        const quiz = await this.getQuizById(attemptData.quizId);
        if (!quiz) {
            throw new Error('Quiz not found');
        }
        const gradingResult = this.autoGradeQuiz(quiz, attemptData.answers);
        const attemptRef = this.db.collection('quizAttempts').doc();
        const now = new Date();
        const quizAttempt = {
            id: attemptRef.id,
            quizId: attemptData.quizId,
            studentId,
            answers: attemptData.answers,
            score: gradingResult.score,
            totalPoints: gradingResult.totalPoints,
            percentage: gradingResult.percentage,
            timeSpent: attemptData.timeSpent,
            isCompleted: true,
            submittedAt: firestore_1.Timestamp.fromDate(now),
            gradedAt: firestore_1.Timestamp.fromDate(now),
        };
        await attemptRef.set(quizAttempt);
        return quizAttempt;
    }
    autoGradeQuiz(quiz, answers) {
        let score = 0;
        const totalPoints = quiz.totalPoints;
        quiz.questions.forEach(question => {
            const studentAnswer = answers[question.id];
            if (this.isAnswerCorrect(question, studentAnswer)) {
                score += question.points;
            }
        });
        const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
        return { score, totalPoints, percentage };
    }
    isAnswerCorrect(question, studentAnswer) {
        if (studentAnswer === undefined || studentAnswer === null) {
            return false;
        }
        switch (question.type) {
            case 'multiple_choice':
                return studentAnswer === question.correctAnswer;
            case 'multiple_select':
                if (!Array.isArray(studentAnswer) || !Array.isArray(question.correctAnswer)) {
                    return false;
                }
                const correctAnswers = question.correctAnswer;
                const studentAnswers = studentAnswer;
                return correctAnswers.length === studentAnswers.length &&
                    correctAnswers.every(answer => studentAnswers.includes(answer));
            case 'true_false':
                return studentAnswer === question.correctAnswer;
            case 'short_answer':
                if (typeof studentAnswer !== 'string') {
                    return false;
                }
                const correctAnswer = question.correctAnswer.toLowerCase().trim();
                const studentAnswerStr = studentAnswer.toLowerCase().trim();
                return correctAnswer === studentAnswerStr;
            case 'numeric':
                if (typeof studentAnswer !== 'number' || typeof question.correctAnswer !== 'number') {
                    return false;
                }
                const tolerance = 0.01;
                return Math.abs(studentAnswer - question.correctAnswer) <= tolerance;
            default:
                return false;
        }
    }
    async getQuizAttemptsByStudent(studentId, quizId) {
        let query = this.db.collection('quizAttempts').where('studentId', '==', studentId);
        if (quizId) {
            query = query.where('quizId', '==', quizId);
        }
        const snapshot = await query.orderBy('submittedAt', 'desc').get();
        const attempts = [];
        snapshot.forEach((doc) => {
            const attemptData = doc.data();
            attemptData.id = doc.id;
            attempts.push(attemptData);
        });
        return attempts;
    }
    async getQuizAttemptsByQuiz(quizId) {
        const snapshot = await this.db.collection('quizAttempts')
            .where('quizId', '==', quizId)
            .orderBy('submittedAt', 'desc')
            .get();
        const attempts = [];
        snapshot.forEach((doc) => {
            const attemptData = doc.data();
            attemptData.id = doc.id;
            attempts.push(attemptData);
        });
        return attempts;
    }
    async getBestQuizAttempt(studentId, quizId) {
        const attempts = await this.getQuizAttemptsByStudent(studentId, quizId);
        if (attempts.length === 0) {
            return null;
        }
        return attempts.reduce((best, current) => current.score > best.score ? current : best);
    }
}
exports.QuizService = QuizService;
//# sourceMappingURL=quizService.js.map