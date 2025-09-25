import { Router } from 'express';
import { authenticate, adminOnly } from '../middleware/auth';
import { AdminController } from '../controllers/adminController';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// User management routes
router.get('/users', adminController.getUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.post('/users', adminController.createUser.bind(adminController));
router.patch('/users/:id', adminController.updateUser.bind(adminController));
router.delete('/users/:id', adminController.deleteUser.bind(adminController));
router.post('/restore/:id', adminController.restoreUser.bind(adminController));
router.delete('/users/:id/permanent', adminController.permanentlyDeleteUser.bind(adminController));

// Role-specific user routes
router.get('/professors', adminController.getProfessors.bind(adminController));
router.get('/students', adminController.getStudents.bind(adminController));

export default router;
