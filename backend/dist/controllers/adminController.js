"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const userService_1 = require("../services/userService");
const userService = new userService_1.UserService();
class AdminController {
    async getUsers(req, res) {
        try {
            const { page = 1, limit = 10, role, isActive, search } = req.query;
            const params = {
                page: parseInt(page),
                limit: parseInt(limit),
                role: role,
                isActive: isActive ? isActive === 'true' : undefined,
                search: search,
            };
            const result = await userService.getUsers(params);
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
                    message: error instanceof Error ? error.message : 'Failed to get users',
                },
            });
        }
    }
    async getUserById(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get user',
                },
            });
        }
    }
    async createUser(req, res) {
        try {
            const userData = req.body;
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
            const { passwordHash, ...userWithoutPassword } = user;
            res.status(201).json({
                success: true,
                data: { user: userWithoutPassword },
                message: 'User created successfully',
            });
        }
        catch (error) {
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
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: { code: 'MISSING_USER_ID', message: 'User ID is required' }
                });
                return;
            }
            const user = await userService.updateUser(id, updates);
            const { passwordHash, ...userWithoutPassword } = user;
            res.status(200).json({
                success: true,
                data: { user: userWithoutPassword },
                message: 'User updated successfully',
            });
        }
        catch (error) {
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
    async deleteUser(req, res) {
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
        }
        catch (error) {
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
    async restoreUser(req, res) {
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
        }
        catch (error) {
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
    async permanentlyDeleteUser(req, res) {
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
        }
        catch (error) {
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
    async getProfessors(req, res) {
        try {
            const professors = await userService.getProfessors();
            res.status(200).json({
                success: true,
                data: { professors },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to get professors',
                },
            });
        }
    }
    async getStudents(req, res) {
        try {
            const students = await userService.getStudents();
            res.status(200).json({
                success: true,
                data: { students },
            });
        }
        catch (error) {
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
exports.AdminController = AdminController;
//# sourceMappingURL=adminController.js.map