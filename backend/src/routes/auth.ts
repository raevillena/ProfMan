import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { loginSchema, registerSchema, changePasswordSchema } from '../validation/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', validateBody(loginSchema), authController.login.bind(authController));
router.post('/register', validateBody(registerSchema), authController.register.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/change-password', validateBody(changePasswordSchema), authController.changePassword.bind(authController));
router.get('/me', authController.getCurrentUser.bind(authController));

export default router;
