import { Request, Response } from 'express';
import { BranchService } from '../services/branchService';
import { CreateBranchRequest, UpdateBranchRequest } from '../models/Branch';

const branchService = new BranchService();

export class BranchController {
  // Get all branches with pagination and filtering
  async getBranches(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        subjectId,
        professorId,
        isActive,
        search
      } = req.query;

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        subjectId: subjectId as string | undefined,
        professorId: professorId as string | undefined,
        isActive: isActive ? isActive === 'true' : undefined,
        search: search as string | undefined,
      };

      const result = await branchService.getBranches(params);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get branches',
        },
      });
    }
  }

  // Get branch by ID
  async getBranchById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_BRANCH_ID', message: 'Branch ID is required' }
        });
        return;
      }

      const branch = await branchService.getBranchById(id);

      if (!branch) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BRANCH_NOT_FOUND',
            message: 'Branch not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { branch },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get branch',
        },
      });
    }
  }

  // Create new branch
  async createBranch(req: Request, res: Response): Promise<void> {
    try {
      const branchData: CreateBranchRequest = req.body;

      // Validate required fields
      if (!branchData.subjectId || !branchData.professorId || !branchData.title || !branchData.description) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Subject ID, professor ID, title, and description are required',
          },
        });
        return;
      }

      const branch = await branchService.createBranch(branchData);

      res.status(201).json({
        success: true,
        data: { branch },
        message: 'Branch created successfully',
      });
    } catch (error) {
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('not a professor'))) {
        res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create branch',
        },
      });
    }
  }

  // Update branch
  async updateBranch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateBranchRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_BRANCH_ID', message: 'Branch ID is required' }
        });
        return;
      }

      const branch = await branchService.updateBranch(id, updates);

      res.status(200).json({
        success: true,
        data: { branch },
        message: 'Branch updated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BRANCH_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update branch',
        },
      });
    }
  }

  // Soft delete branch
  async deleteBranch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_BRANCH_ID', message: 'Branch ID is required' }
        });
        return;
      }

      await branchService.deleteBranch(id);

      res.status(200).json({
        success: true,
        message: 'Branch deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BRANCH_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete branch',
        },
      });
    }
  }

  // Restore branch
  async restoreBranch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_BRANCH_ID', message: 'Branch ID is required' }
        });
        return;
      }

      await branchService.restoreBranch(id);

      res.status(200).json({
        success: true,
        message: 'Branch restored successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BRANCH_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to restore branch',
        },
      });
    }
  }

  // Permanently delete branch
  async permanentlyDeleteBranch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_BRANCH_ID', message: 'Branch ID is required' }
        });
        return;
      }

      await branchService.permanentlyDeleteBranch(id);

      res.status(200).json({
        success: true,
        message: 'Branch permanently deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'BRANCH_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to permanently delete branch',
        },
      });
    }
  }

  // Get branches by professor
  async getBranchesByProfessor(req: Request, res: Response): Promise<void> {
    try {
      const { professorId } = req.params;

      if (!professorId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PROFESSOR_ID', message: 'Professor ID is required' }
        });
        return;
      }

      const branches = await branchService.getBranchesByProfessor(professorId);

      res.status(200).json({
        success: true,
        data: { branches },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get branches by professor',
        },
      });
    }
  }

  // Get branches by subject
  async getBranchesBySubject(req: Request, res: Response): Promise<void> {
    try {
      const { subjectId } = req.params;

      if (!subjectId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      const branches = await branchService.getBranchesBySubject(subjectId);

      res.status(200).json({
        success: true,
        data: { branches },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get branches by subject',
        },
      });
    }
  }

  // Get active branches
  async getActiveBranches(req: Request, res: Response): Promise<void> {
    try {
      const branches = await branchService.getActiveBranches();

      res.status(200).json({
        success: true,
        data: { branches },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get active branches',
        },
      });
    }
  }

  // Clone branch
  async cloneBranch(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { professorId, title } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_BRANCH_ID', message: 'Branch ID is required' }
        });
        return;
      }

      if (!professorId || !title) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Professor ID and title are required',
          },
        });
        return;
      }

      const branch = await branchService.cloneBranch(id, professorId, title);

      res.status(201).json({
        success: true,
        data: { branch },
        message: 'Branch cloned successfully',
      });
    } catch (error) {
      if (error instanceof Error && (error.message.includes('not found') || error.message.includes('not a professor'))) {
        res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to clone branch',
        },
      });
    }
  }
}
