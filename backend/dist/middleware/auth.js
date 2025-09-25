"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyRole = exports.professorOrAdmin = exports.adminOnly = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firebase_1 = require("../utils/firebase");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Access token required',
                },
            });
            return;
        }
        const token = authHeader.substring(7);
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const db = (0, firebase_1.getFirestore)();
        const userDoc = await db.collection('users').doc(decoded.userId).get();
        if (!userDoc.exists) {
            res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'User not found',
                },
            });
            return;
        }
        const userData = userDoc.data();
        if (!userData.isActive || userData.isDeleted) {
            res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Account is inactive or deleted',
                },
            });
            return;
        }
        const { passwordHash, ...userWithoutPassword } = userData;
        req.user = userWithoutPassword;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid token',
                },
            });
            return;
        }
        console.error('Authentication error:', error);
        res.status(500).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Authentication failed',
            },
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                },
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                error: {
                    code: 'FORBIDDEN',
                    message: 'Insufficient permissions',
                },
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
exports.adminOnly = (0, exports.authorize)('admin');
exports.professorOrAdmin = (0, exports.authorize)('professor', 'admin');
exports.anyRole = (0, exports.authorize)('admin', 'professor', 'student');
//# sourceMappingURL=auth.js.map