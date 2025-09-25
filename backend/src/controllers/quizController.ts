import { Request, Response } from 'express';
import { QuizService } from '../services/quizService';
import { CreateQuizRequest, UpdateQuizRequest, SubmitQuizAttemptRequest } from '../models/Quiz';
import { validate } from '../middleware/validation';

export class QuizController {
  private quizService: QuizService;

  constructor() {
    this.quizService = new QuizService();
  }

  // Get all quizzes
  async getQuizzes(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, search, isActive, isDeleted, branchId } = req.query;
      const parsedPage = page ? parseInt(page as string) : undefined;
      const parsedLimit = limit ? parseInt(limit as string) : undefined;
      const parsedIsActive = isActive !== undefined ? (isActive === 'true') : undefined;
      const parsedIsDeleted = isDeleted !== undefined ? (isDeleted === 'true') : undefined;

      const result = await this.quizService.getQuizzes({
        page: parsedPage,
        limit: parsedLimit,
        search: search as string,
        isActive: parsedIsActive,
        isDeleted: parsedIsDeleted,
        branchId: branchId as string,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Get quiz by ID
  async getQuizById(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Create new quiz
  async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      const quizData: CreateQuizRequest = req.body;
      const newQuiz = await this.quizService.createQuiz(quizData);
      res.status(201).json({ success: true, data: newQuiz });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Update quiz
  async updateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
        return;
      }

      const updates: UpdateQuizRequest = req.body;
      const updatedQuiz = await this.quizService.updateQuiz(id, updates);
      if (!updatedQuiz) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } });
        return;
      }
      res.status(200).json({ success: true, data: updatedQuiz });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Soft delete quiz
  async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
        return;
      }

      await this.quizService.deleteQuiz(id);
      res.status(200).json({ success: true, message: 'Quiz soft-deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Restore soft-deleted quiz
  async restoreQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
        return;
      }

      await this.quizService.restoreQuiz(id);
      res.status(200).json({ success: true, message: 'Quiz restored successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Permanently delete quiz
  async permanentlyDeleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
        return;
      }

      await this.quizService.permanentlyDeleteQuiz(id);
      res.status(200).json({ success: true, message: 'Quiz permanently deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Get quizzes by branch
  async getQuizzesByBranch(req: Request, res: Response): Promise<void> {
    try {
      const { branchId } = req.params;
      if (!branchId) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Branch ID is required' } });
        return;
      }

      const quizzes = await this.quizService.getQuizzesByBranch(branchId);
      res.status(200).json({ success: true, data: quizzes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Submit quiz attempt
  async submitQuizAttempt(req: Request, res: Response): Promise<void> {
    try {
      const attemptData: SubmitQuizAttemptRequest = req.body;
      const studentId = (req as any).user?.id; // From auth middleware

      if (!studentId) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Student ID required' } });
        return;
      }

      const quizAttempt = await this.quizService.submitQuizAttempt(attemptData, studentId);
      res.status(201).json({ success: true, data: quizAttempt });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Get quiz attempts by student
  async getQuizAttemptsByStudent(req: Request, res: Response): Promise<void> {
    try {
      const { studentId } = req.params;
      const { quizId } = req.query;

      if (!studentId) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Student ID is required' } });
        return;
      }

      const attempts = await this.quizService.getQuizAttemptsByStudent(studentId, quizId as string);
      res.status(200).json({ success: true, data: attempts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Get quiz attempts by quiz
  async getQuizAttemptsByQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId } = req.params;
      if (!quizId) {
        res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Quiz ID is required' } });
        return;
      }

      const attempts = await this.quizService.getQuizAttemptsByQuiz(quizId);
      res.status(200).json({ success: true, data: attempts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }

  // Get best quiz attempt for student
  async getBestQuizAttempt(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: error.message } });
    }
  }
}