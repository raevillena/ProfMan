import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { loginSchema, registerSchema, changePasswordSchema, studentAutoCreateSchema } from '../validation/auth';

const authService = new AuthService();

export class AuthController {
  // Login endpoint
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Check if this looks like a student login (institutional email + student number)
      const isStudentLogin = email.includes('@') && /^\d+$/.test(password);
      
      let result;
      
      if (isStudentLogin) {
        // Auto-create student if needed
        result = await authService.autoCreateStudent(email, password);
      } else {
        // Regular login
        result = await authService.login({ email, password });
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error instanceof Error ? error.message : 'Login failed',
        },
      });
    }
  }

  // Register endpoint
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const user = await authService.createUser(userData);

      res.status(201).json({
        success: true,
        data: { user },
        message: 'User created successfully',
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error instanceof Error ? error.message : 'Registration failed',
        },
      });
    }
  }

  // Change password endpoint
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      await authService.changePassword(userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        success: false,
        error: {
          code: 'PASSWORD_CHANGE_FAILED',
          message: error instanceof Error ? error.message : 'Password change failed',
        },
      });
    }
  }

  // Refresh token endpoint
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'REFRESH_TOKEN_REQUIRED',
            message: 'Refresh token is required',
          },
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_TOKEN_FAILED',
          message: error instanceof Error ? error.message : 'Refresh token failed',
        },
      });
    }
  }

  // Get current user endpoint
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get current user',
        },
      });
    }
  }
}
