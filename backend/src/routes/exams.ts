import { Router } from 'express';
import { authenticate, professorOrAdmin } from '../middleware/auth';
import { ExamController, upload } from '../controllers/examController';

const router = Router();
const examController = new ExamController();

// All exam routes require authentication
router.use(authenticate);

// Exam CRUD operations
router.get('/professor', examController.getExamsByProfessor.bind(examController));
router.get('/branch/:branchId', examController.getExamsByBranch.bind(examController));
router.get('/:id', examController.getExamById.bind(examController));
router.post('/', professorOrAdmin, examController.createExam.bind(examController));
router.patch('/:id', professorOrAdmin, examController.updateExam.bind(examController));
router.delete('/:id', professorOrAdmin, examController.deleteExam.bind(examController));

// Exam submission operations
router.post('/:id/submit', examController.submitExam.bind(examController));
router.get('/:id/submissions', professorOrAdmin, examController.getExamSubmissions.bind(examController));
router.patch('/submissions/:submissionId/grade', professorOrAdmin, examController.gradeExamSubmission.bind(examController));

// File upload operations
router.post('/upload', professorOrAdmin, upload.single('file'), examController.uploadExamFile.bind(examController));

export default router;
