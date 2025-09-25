"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const quizService_1 = require("../services/quizService");
class QuizController {
    constructor() {
        this.quizService = new quizService_1.QuizService();
    }
    async getQuizzes(req, res) {
        try {
            const { page, limit, search, isActive, isDeleted, branchId } = req.query;
            const parsedPage = page ? parseInt(page) : undefined;
            const parsedLimit = limit ? parseInt(limit) : undefined;
            const parsedIsActive = isActive !== undefined ? (isActive === 'true') : undefined;
            const parsedIsDeleted = isDeleted !== undefined ? (isDeleted === 'true') : undefined;
            const result = await this.quizService.getQuizzes({
                page: parsedPage,
                limit: parsedLimit,
                search: search,
                isActive: parsedIsActive,
                isDeleted: parsedIsDeleted,
                branchId: branchId,
            });
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async getQuizById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
                return;
            }
            const quiz = await this.quizService.getQuizById(id);
            if (!quiz) {
                res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
                return;
            }
            res.status(200).json({ success: true, data: quiz });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async createQuiz(req, res) {
        try {
            const quizData = req.body;
            const newQuiz = await this.quizService.createQuiz(quizData);
            res.status(201).json({ success: true, data: newQuiz });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async updateQuiz(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
                return;
            }
            const updates = req.body;
            const updatedQuiz = await this.quizService.updateQuiz(id, updates);
            if (!updatedQuiz) {
                res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
                return;
            }
            res.status(200).json({ success: true, data: updatedQuiz });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async deleteQuiz(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
                return;
            }
            await this.quizService.deleteQuiz(id);
            res.status(200).json({ success: true, message: 'Quiz soft-deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async restoreQuiz(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
                return;
            }
            await this.quizService.restoreQuiz(id);
            res.status(200).json({ success: true, message: 'Quiz restored successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async permanentlyDeleteQuiz(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
                return;
            }
            await this.quizService.permanentlyDeleteQuiz(id);
            res.status(200).json({ success: true, message: 'Quiz permanently deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async getQuizzesByBranch(req, res) {
        try {
            const { branchId } = req.params;
            if (!branchId) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Branch ID is required' } });
                return;
            }
            const quizzes = await this.quizService.getQuizzesByBranch(branchId);
            res.status(200).json({ success: true, data: quizzes });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async submitQuizAttempt(req, res) {
        try {
            const attemptData = req.body;
            const studentId = req.user?.id;
            if (!studentId) {
                res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Student ID required' } });
                return;
            }
            const quizAttempt = await this.quizService.submitQuizAttempt(attemptData, studentId);
            res.status(201).json({ success: true, data: quizAttempt });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async getQuizAttemptsByStudent(req, res) {
        try {
            const { studentId } = req.params;
            const { quizId } = req.query;
            if (!studentId) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Student ID is required' } });
                return;
            }
            const attempts = await this.quizService.getQuizAttemptsByStudent(studentId, quizId);
            res.status(200).json({ success: true, data: attempts });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async getQuizAttemptsByQuiz(req, res) {
        try {
            const { quizId } = req.params;
            if (!quizId) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
                return;
            }
            const attempts = await this.quizService.getQuizAttemptsByQuiz(quizId);
            res.status(200).json({ success: true, data: attempts });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
    async getBestQuizAttempt(req, res) {
        try {
            const { studentId, quizId } = req.params;
            if (!studentId || !quizId) {
                res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Student ID and Quiz ID are required' } });
                return;
            }
            const attempt = await this.quizService.getBestQuizAttempt(studentId, quizId);
            if (!attempt) {
                res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No attempts found' } });
                return;
            }
            res.status(200).json({ success: true, data: attempt });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
        }
    }
}
exports.QuizController = QuizController;
//# sourceMappingURL=quizController.js.map