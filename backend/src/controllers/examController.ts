import { Request, Response } from 'express';
import { ExamService } from '../services/examService';
import { CreateExamRequest, UpdateExamRequest, SubmitExamRequest, GradeExamRequest } from '../models/Exam';
import multer from 'multer';

const examService = new ExamService();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and media types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('File type not allowed');
      cb(error);
    }
  }
});

export class ExamController {
  // Create exam
  async createExam(req: Request, res: Response): Promise<void> {
    try {
      const professorId = req.user?.id;
      if (!professorId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const examData: CreateExamRequest = req.body;
      const exam = await examService.createExam(examData, professorId);

      res.status(201).json({
        success: true,
        data: { exam },
        message: 'Exam created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create exam'
        }
      });
    }
  }

  // Get exam by ID
  async getExamById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_EXAM_ID', message: 'Exam ID is required' }
        });
        return;
      }
      
      const exam = await examService.getExamById(id);

      if (!exam) {
        res.status(404).json({
          success: false,
          error: { code: 'EXAM_NOT_FOUND', message: 'Exam not found' }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: { exam }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get exam'
        }
      });
    }
  }

  // Get exams by branch
  async getExamsByBranch(req: Request, res: Response): Promise<void> {
    try {
      const { branchId } = req.params;
      const { isActive } = req.query;

      if (!branchId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_BRANCH_ID', message: 'Branch ID is required' }
        });
        return;
      }

      const exams = await examService.getExamsByBranch(
        branchId,
        isActive ? isActive === 'true' : undefined
      );

      res.status(200).json({
        success: true,
        data: { exams }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get exams'
        }
      });
    }
  }

  // Get exams by professor
  async getExamsByProfessor(req: Request, res: Response): Promise<void> {
    try {
      const professorId = req.user?.id;
      if (!professorId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const { isActive } = req.query;
      const exams = await examService.getExamsByProfessor(
        professorId,
        isActive ? isActive === 'true' : undefined
      );

      res.status(200).json({
        success: true,
        data: { exams }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get exams'
        }
      });
    }
  }

  // Update exam
  async updateExam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateExamRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_EXAM_ID', message: 'Exam ID is required' }
        });
        return;
      }

      const exam = await examService.updateExam(id, updateData);

      res.status(200).json({
        success: true,
        data: { exam },
        message: 'Exam updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update exam'
        }
      });
    }
  }

  // Delete exam
  async deleteExam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_EXAM_ID', message: 'Exam ID is required' }
        });
        return;
      }
      
      await examService.deleteExam(id);

      res.status(200).json({
        success: true,
        message: 'Exam deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete exam'
        }
      });
    }
  }

  // Submit exam
  async submitExam(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const studentId = req.user?.id;
      const studentName = req.user?.displayName || 'Unknown Student';

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_EXAM_ID', message: 'Exam ID is required' }
        });
        return;
      }

      if (!studentId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const submissionData: SubmitExamRequest = req.body;
      const submission = await examService.submitExam(id, studentId, studentName, submissionData);

      res.status(200).json({
        success: true,
        data: { submission },
        message: 'Exam submitted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'SUBMISSION_ERROR',
          message: error instanceof Error ? error.message : 'Failed to submit exam'
        }
      });
    }
  }

  // Get exam submissions
  async getExamSubmissions(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { studentId } = req.query;

      if (!id) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_EXAM_ID', message: 'Exam ID is required' }
        });
        return;
      }

      const submissions = await examService.getExamSubmissions(
        id,
        studentId as string
      );

      res.status(200).json({
        success: true,
        data: { submissions }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get submissions'
        }
      });
    }
  }

  // Grade exam submission
  async gradeExamSubmission(req: Request, res: Response): Promise<void> {
    try {
      const { submissionId } = req.params;
      const gradedBy = req.user?.id;

      if (!submissionId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_SUBMISSION_ID', message: 'Submission ID is required' }
        });
        return;
      }

      if (!gradedBy) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const gradeData: GradeExamRequest = req.body;
      const submission = await examService.gradeExamSubmission(submissionId, gradeData, gradedBy);

      res.status(200).json({
        success: true,
        data: { submission },
        message: 'Exam graded successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Failed to grade exam'
        }
      });
    }
  }

  // Upload exam file
  async uploadExamFile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
        });
        return;
      }

      const file = req.file;
      if (!file) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_FILE', message: 'No file provided' }
        });
        return;
      }

      const result = await examService.uploadExamFile(
        userId,
        file.buffer,
        file.originalname,
        file.mimetype
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          data: { fileId: result.fileId },
          message: 'File uploaded successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          error: { code: 'UPLOAD_ERROR', message: result.error || 'Upload failed' }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Upload failed'
        }
      });
    }
  }
}

// Export multer middleware for use in routes
export { upload };
