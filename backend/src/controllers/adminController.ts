import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { CreateUserRequest, UpdateUserRequest } from '../models/User';

const userService = new UserService();

export class AdminController {
  // Get all users with pagination and filtering
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        isActive,
        search
      } = req.query;

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        role: role as 'admin' | 'professor' | 'student' | undefined,
        isActive: isActive ? isActive === 'true' : undefined,
        search: search as string | undefined,
      };

      const result = await userService.getUsers(params);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get users',
        },
      });
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
        return;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get user',
        },
      });
    }
  }

  // Create new user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;

      // Validate required fields
      if (!userData.email || !userData.displayName || !userData.role) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Email, display name, and role are required',
          },
        });
        return;
      }

      const user = await userService.createUser(userData);

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        data: { user: userWithoutPassword },
        message: 'User created successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create user',
        },
      });
    }
  }

  // Update user
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateUserRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
        return;
      }

      const user = await userService.updateUser(id, updates);

      // Remove password hash from response
      const { passwordHash, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        data: { user: userWithoutPassword },
        message: 'User updated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update user',
        },
      });
    }
  }

  // Soft delete user
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
        return;
      }

      await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete user',
        },
      });
    }
  }

  // Restore user
  async restoreUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
        return;
      }

      await userService.restoreUser(id);

      res.status(200).json({
        success: true,
        message: 'User restored successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to restore user',
        },
      });
    }
  }

  // Permanently delete user
  async permanentlyDeleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
        });
        return;
      }

      await userService.permanentlyDeleteUser(id);

      res.status(200).json({
        success: true,
        message: 'User permanently deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to permanently delete user',
        },
      });
    }
  }

  // Get professors
  async getProfessors(req: Request, res: Response): Promise<void> {
    try {
      const professors = await userService.getProfessors();

      res.status(200).json({
        success: true,
        data: { professors },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get professors',
        },
      });
    }
  }

  // Get students
  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const students = await userService.getStudents();

      res.status(200).json({
        success: true,
        data: { students },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get students',
        },
      });
    }
  }
}
