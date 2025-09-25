"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchController = void 0;
const branchService_1 = require("../services/branchService");
const branchService = new branchService_1.BranchService();
class BranchController {
    async getBranches(req, res) {
        try {
            const { page = 1, limit = 10, subjectId, professorId, isActive, search } = req.query;
            const params = {
                page: parseInt(page),
                limit: parseInt(limit),
                subjectId: subjectId,
                professorId: professorId,
                isActive: isActive ? isActive === 'true' : undefined,
                search: search,
            };
            const result = await branchService.getBranches(params);
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
                    message: error instanceof Error ? error.message : 'Failed to get branches',
                },
            });
        }
    }
    async getBranchById(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get branch',
                },
            });
        }
    }
    async createBranch(req, res) {
        try {
            const branchData = req.body;
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
        }
        catch (error) {
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
    async updateBranch(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
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
        }
        catch (error) {
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
    async deleteBranch(req, res) {
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
        }
        catch (error) {
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
    async restoreBranch(req, res) {
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
        }
        catch (error) {
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
    async permanentlyDeleteBranch(req, res) {
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
        }
        catch (error) {
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
    async getBranchesByProfessor(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get branches by professor',
                },
            });
        }
    }
    async getBranchesBySubject(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get branches by subject',
                },
            });
        }
    }
    async getActiveBranches(req, res) {
        try {
            const branches = await branchService.getActiveBranches();
            res.status(200).json({
                success: true,
                data: { branches },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get active branches',
                },
            });
        }
    }
    async cloneBranch(req, res) {
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
        }
        catch (error) {
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
exports.BranchController = BranchController;
//# sourceMappingURL=branchController.js.map