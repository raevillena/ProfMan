"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const subjectService_1 = require("../services/subjectService");
const subjectService = new subjectService_1.SubjectService();
class SubjectController {
    async getSubjects(req, res) {
        try {
            const { page = 1, limit = 10, isActive, search } = req.query;
            const params = {
                page: parseInt(page),
                limit: parseInt(limit),
                isActive: isActive ? isActive === 'true' : undefined,
                search: search,
            };
            const result = await subjectService.getSubjects(params);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get subjects',
                },
            });
        }
    }
    async getSubjectById(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get subject',
                },
            });
        }
    }
    async getSubjectByCode(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get subject',
                },
            });
        }
    }
    async createSubject(req, res) {
        try {
            const subjectData = req.body;
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
        }
        catch (error) {
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
    async updateSubject(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: { code: 'MISSING_SUBJECT_ID', message: 'Subject ID is required' }
                });
                return;
            }
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
        }
        catch (error) {
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
    async deleteSubject(req, res) {
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
        }
        catch (error) {
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
    async restoreSubject(req, res) {
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
        }
        catch (error) {
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
    async permanentlyDeleteSubject(req, res) {
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
        }
        catch (error) {
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
    async getActiveSubjects(req, res) {
        try {
            const subjects = await subjectService.getActiveSubjects();
            res.status(200).json({
                success: true,
                data: { subjects },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get active subjects',
                },
            });
        }
    }
    async getSubjectsByProfessor(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get subjects by professor',
                },
            });
        }
    }
    async assignSubjectToProfessors(req, res) {
        try {
            const { id } = req.params;
            const assignmentData = req.body;
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to assign subject to professors',
                },
            });
        }
    }
    async getAssignedProfessors(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get assigned professors',
                },
            });
        }
    }
    async getSubjectsAssignedToProfessor(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get subjects assigned to professor',
                },
            });
        }
    }
    async removeProfessorAssignment(req, res) {
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
        }
        catch (error) {
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
exports.SubjectController = SubjectController;
//# sourceMappingURL=subjectController.js.map