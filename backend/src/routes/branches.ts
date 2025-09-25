import { Router } from 'express';
import { authenticate, adminOnly, professorOrAdmin } from '../middleware/auth';
import { BranchController } from '../controllers/branchController';

const router = Router();
const branchController = new BranchController();

// Public routes (no authentication required)
router.get('/active', branchController.getActiveBranches.bind(branchController));

// All other routes require authentication
router.use(authenticate);

// Admin-only routes
router.get('/', adminOnly, branchController.getBranches.bind(branchController));
router.get('/:id', branchController.getBranchById.bind(branchController));
router.post('/', professorOrAdmin, branchController.createBranch.bind(branchController));
router.patch('/:id', professorOrAdmin, branchController.updateBranch.bind(branchController));
router.delete('/:id', professorOrAdmin, branchController.deleteBranch.bind(branchController));
router.post('/:id/restore', adminOnly, branchController.restoreBranch.bind(branchController));
router.delete('/:id/permanent', adminOnly, branchController.permanentlyDeleteBranch.bind(branchController));

// Professor and Admin routes
router.get('/professor/:professorId', professorOrAdmin, branchController.getBranchesByProfessor.bind(branchController));
router.get('/subject/:subjectId', professorOrAdmin, branchController.getBranchesBySubject.bind(branchController));
router.post('/:id/clone', professorOrAdmin, branchController.cloneBranch.bind(branchController));

export default router;