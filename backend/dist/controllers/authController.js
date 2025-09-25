"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const isStudentLogin = email.includes('@') && /^\d+$/.test(password);
            let result;
            if (isStudentLogin) {
                result = await authService.autoCreateStudent(email, password);
            }
            else {
                result = await authService.login({ email, password });
            }
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
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
    async register(req, res) {
        try {
            const userData = req.body;
            const user = await authService.createUser(userData);
            res.status(201).json({
                success: true,
                data: { user },
                message: 'User created successfully',
            });
        }
        catch (error) {
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
    async changePassword(req, res) {
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
        }
        catch (error) {
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
    async refreshToken(req, res) {
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
        }
        catch (error) {
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
    async getCurrentUser(req, res) {
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
        }
        catch (error) {
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
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map