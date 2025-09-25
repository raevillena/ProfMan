import { Router } from 'express';
import { authenticate, adminOnly, professorOrAdmin } from '../middleware/auth';
import { SubjectController } from '../controllers/subjectController';

const router = Router();
const subjectController = new SubjectController();

// Public routes (no authentication required)
router.get('/active', subjectController.getActiveSubjects.bind(subjectController));
router.get('/code/:code', subjectController.getSubjectByCode.bind(subjectController));

// All other routes require authentication
router.use(authenticate);

// Routes accessible by professors and admins
router.get('/', professorOrAdmin, subjectController.getSubjects.bind(subjectController));

// Admin-only routes
router.post('/', adminOnly, subjectController.createSubject.bind(subjectController));

// Assignment routes (Admin only) - MUST come before /:id routes
router.post('/:id/assign', adminOnly, subjectController.assignSubjectToProfessors.bind(subjectController));
router.get('/:id/assignments', adminOnly, subjectController.getAssignedProfessors.bind(subjectController));
router.get('/assigned/:professorId', adminOnly, subjectController.getSubjectsAssignedToProfessor.bind(subjectController));
router.delete('/:id/assignments/:professorId', adminOnly, subjectController.removeProfessorAssignment.bind(subjectController));

// Professor and Admin routes
router.get('/professor/:professorId', professorOrAdmin, subjectController.getSubjectsByProfessor.bind(subjectController));

// Generic /:id routes (must come after specific routes)
router.get('/:id', subjectController.getSubjectById.bind(subjectController));
router.patch('/:id', adminOnly, subjectController.updateSubject.bind(subjectController));
router.delete('/:id', adminOnly, subjectController.deleteSubject.bind(subjectController));
router.post('/:id/restore', adminOnly, subjectController.restoreSubject.bind(subjectController));
router.delete('/:id/permanent', adminOnly, subjectController.permanentlyDeleteSubject.bind(subjectController));

export default router;