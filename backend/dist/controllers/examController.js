"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.ExamController = void 0;
const examService_1 = require("../services/examService");
const multer_1 = __importDefault(require("multer"));
const examService = new examService_1.ExamService();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
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
        }
        else {
            const error = new Error('File type not allowed');
            cb(error);
        }
    }
});
exports.upload = upload;
class ExamController {
    async createExam(req, res) {
        try {
            const professorId = req.user?.id;
            if (!professorId) {
                res.status(401).json({
                    success: false,
                    error: { code: 'UNAUTHORIZED', message: 'User not authenticated' }
                });
                return;
            }
            const examData = req.body;
            const exam = await examService.createExam(examData, professorId);
            res.status(201).json({
                success: true,
                data: { exam },
                message: 'Exam created successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to create exam'
                }
            });
        }
    }
    async getExamById(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get exam'
                }
            });
        }
    }
    async getExamsByBranch(req, res) {
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
            const exams = await examService.getExamsByBranch(branchId, isActive ? isActive === 'true' : undefined);
            res.status(200).json({
                success: true,
                data: { exams }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get exams'
                }
            });
        }
    }
    async getExamsByProfessor(req, res) {
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
            const exams = await examService.getExamsByProfessor(professorId, isActive ? isActive === 'true' : undefined);
            res.status(200).json({
                success: true,
                data: { exams }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get exams'
                }
            });
        }
    }
    async updateExam(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to update exam'
                }
            });
        }
    }
    async deleteExam(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to delete exam'
                }
            });
        }
    }
    async submitExam(req, res) {
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
            const submissionData = req.body;
            const submission = await examService.submitExam(id, studentId, studentName, submissionData);
            res.status(200).json({
                success: true,
                data: { submission },
                message: 'Exam submitted successfully'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: {
                    code: 'SUBMISSION_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to submit exam'
                }
            });
        }
    }
    async getExamSubmissions(req, res) {
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
            const submissions = await examService.getExamSubmissions(id, studentId);
            res.status(200).json({
                success: true,
                data: { submissions }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get submissions'
                }
            });
        }
    }
    async gradeExamSubmission(req, res) {
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
            const gradeData = req.body;
            const submission = await examService.gradeExamSubmission(submissionId, gradeData, gradedBy);
            res.status(200).json({
                success: true,
                data: { submission },
                message: 'Exam graded successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to grade exam'
                }
            });
        }
    }
    async uploadExamFile(req, res) {
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
            const result = await examService.uploadExamFile(userId, file.buffer, file.originalname, file.mimetype);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: { fileId: result.fileId },
                    message: 'File uploaded successfully'
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: { code: 'UPLOAD_ERROR', message: result.error || 'Upload failed' }
                });
            }
        }
        catch (error) {
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
exports.ExamController = ExamController;
//# sourceMappingURL=examController.js.map