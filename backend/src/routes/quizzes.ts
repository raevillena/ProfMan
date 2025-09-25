import { Router } from 'express';
import { QuizController } from '../controllers/quizController';
import { authenticate, adminOnly, professorOrAdmin, anyRole } from '../middleware/auth';

const router = Router();
const quizController = new QuizController();

// Routes requiring authentication
router.use(authenticate);

// Professor or Admin routes (quiz management)
router.post('/', professorOrAdmin, quizController.createQuiz.bind(quizController));
router.patch('/:id', professorOrAdmin, quizController.updateQuiz.bind(quizController));
router.delete('/:id', professorOrAdmin, quizController.deleteQuiz.bind(quizController)); // Soft delete
router.post('/:id/restore', adminOnly, quizController.restoreQuiz.bind(quizController));
router.delete('/:id/permanent', adminOnly, quizController.permanentlyDeleteQuiz.bind(quizController));

// Any authenticated role can view quizzes
router.get('/', anyRole, quizController.getQuizzes.bind(quizController));
router.get('/:id', anyRole, quizController.getQuizById.bind(quizController));
router.get('/branch/:branchId', anyRole, quizController.getQuizzesByBranch.bind(quizController));

// Student routes (quiz taking)
router.post('/submit', anyRole, quizController.submitQuizAttempt.bind(quizController));

// Quiz attempts (students can view their own, professors can view all for their quizzes)
router.get('/attempts/student/:studentId', anyRole, quizController.getQuizAttemptsByStudent.bind(quizController));
router.get('/attempts/quiz/:quizId', professorOrAdmin, quizController.getQuizAttemptsByQuiz.bind(quizController));
router.get('/attempts/best/:studentId/:quizId', anyRole, quizController.getBestQuizAttempt.bind(quizController));

export default router;