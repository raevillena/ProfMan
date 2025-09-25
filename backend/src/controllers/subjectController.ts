import { Request, Response } from 'express';
import { SubjectService } from '../services/subjectService';
import { CreateSubjectRequest, UpdateSubjectRequest, AssignSubjectRequest } from '../models/Subject';

const subjectService = new SubjectService();

export class SubjectController {
  // Get all subjects with pagination and filtering
  async getSubjects(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        isActive,
        search
      } = req.query;

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        isActive: isActive ? isActive === 'true' : undefined,
        search: search as string | undefined,
      };

      const result = await subjectService.getSubjects(params);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get subjects',
        },
      });
    }
  }

  // Get subject by ID
  async getSubjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      const subject = await subjectService.getSubjectById(id);

      if (!subject) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SUBJECT_NOT_FOUND',
            message: 'Subject not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { subject },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get subject',
        },
      });
    }
  }

  // Get subject by code
  async getSubjectByCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      if (!code) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_CODE', message: 'Subject code is required' }
        });
        return;
      }

      const subject = await subjectService.getSubjectByCode(code);

      if (!subject) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SUBJECT_NOT_FOUND',
            message: 'Subject not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { subject },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get subject',
        },
      });
    }
  }

  // Create new subject
  async createSubject(req: Request, res: Response): Promise<void> {
    try {
      const subjectData: CreateSubjectRequest = req.body;

      // Validate required fields
      if (!subjectData.code || !subjectData.title || !subjectData.description || subjectData.credits === undefined) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Code, title, description, and credits are required',
          },
        });
        return;
      }

      // Validate credits
      if (subjectData.credits < 1 || subjectData.credits > 6) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CREDITS',
            message: 'Credits must be between 1 and 6',
          },
        });
        return;
      }

      const createdBy = req.user?.id;
      if (!createdBy) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const subject = await subjectService.createSubject(subjectData, createdBy);

      res.status(201).json({
        success: true,
        data: { subject },
        message: 'Subject created successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'SUBJECT_EXISTS',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create subject',
        },
      });
    }
  }

  // Update subject
  async updateSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateSubjectRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      // Validate credits if provided
      if (updates.credits !== undefined && (updates.credits < 1 || updates.credits > 6)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CREDITS',
            message: 'Credits must be between 1 and 6',
          },
        });
        return;
      }

      const subject = await subjectService.updateSubject(id, updates);

      res.status(200).json({
        success: true,
        data: { subject },
        message: 'Subject updated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SUBJECT_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({
          success: false,
          error: {
            code: 'SUBJECT_EXISTS',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update subject',
        },
      });
    }
  }

  // Soft delete subject
  async deleteSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      await subjectService.deleteSubject(id);

      res.status(200).json({
        success: true,
        message: 'Subject deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SUBJECT_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete subject',
        },
      });
    }
  }

  // Restore subject
  async restoreSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      await subjectService.restoreSubject(id);

      res.status(200).json({
        success: true,
        message: 'Subject restored successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SUBJECT_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to restore subject',
        },
      });
    }
  }

  // Permanently delete subject
  async permanentlyDeleteSubject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      await subjectService.permanentlyDeleteSubject(id);

      res.status(200).json({
        success: true,
        message: 'Subject permanently deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SUBJECT_NOT_FOUND',
            message: error.message,
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to permanently delete subject',
        },
      });
    }
  }

  // Get active subjects
  async getActiveSubjects(req: Request, res: Response): Promise<void> {
    try {
      const subjects = await subjectService.getActiveSubjects();

      res.status(200).json({
        success: true,
        data: { subjects },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get active subjects',
        },
      });
    }
  }

  // Get subjects by professor
  async getSubjectsByProfessor(req: Request, res: Response): Promise<void> {
    try {
      const { professorId } = req.params;

      if (!professorId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PROFESSOR_ID', message: 'Professor ID is required' }
        });
        return;
      }

      const subjects = await subjectService.getSubjectsByProfessor(professorId);

      res.status(200).json({
        success: true,
        data: { subjects },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get subjects by professor',
        },
      });
    }
  }

  // Assign subject to professors
  async assignSubjectToProfessors(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const assignmentData: AssignSubjectRequest = req.body;
      const assignedBy = req.user?.id;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      if (!assignedBy) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const updatedSubject = await subjectService.assignSubjectToProfessors(id, assignmentData, assignedBy);

      res.status(200).json({
        success: true,
        data: { subject: updatedSubject },
        message: 'Subject assigned to professors successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to assign subject to professors',
        },
      });
    }
  }

  // Get assigned professors for a subject
  async getAssignedProfessors(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
        });
        return;
      }

      const assignments = await subjectService.getAssignedProfessors(id);

      res.status(200).json({
        success: true,
        data: { assignments },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get assigned professors',
        },
      });
    }
  }

  // Get subjects assigned to a professor
  async getSubjectsAssignedToProfessor(req: Request, res: Response): Promise<void> {
    try {
      const { professorId } = req.params;

      if (!professorId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PROFESSOR_ID', message: 'Professor ID is required' }
        });
        return;
      }

      const subjects = await subjectService.getSubjectsAssignedToProfessor(professorId);

      res.status(200).json({
        success: true,
        data: { subjects },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get subjects assigned to professor',
        },
      });
    }
  }

  // Remove professor assignment from subject
  async removeProfessorAssignment(req: Request, res: Response): Promise<void> {
    try {
      const { id, professorId } = req.params;

      if (!id || !professorId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PARAMETERS', message: 'Subject ID and Professor ID are required' }
        });
        return;
      }

      await subjectService.removeProfessorAssignment(id, professorId);

      res.status(200).json({
        success: true,
        message: 'Professor assignment removed successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to remove professor assignment',
        },
      });
    }
  }
}
