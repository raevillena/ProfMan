"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQuerySchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const yup = __importStar(require("yup"));
exports.createUserSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
        .required('Password is required'),
    displayName: yup
        .string()
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name must be less than 50 characters')
        .required('Display name is required'),
    role: yup
        .string()
        .oneOf(['admin', 'professor', 'student'], 'Invalid role')
        .required('Role is required'),
    studentNumber: yup
        .string()
        .when('role', {
        is: 'student',
        then: (schema) => schema.required('Student number is required for students'),
        otherwise: (schema) => schema.optional(),
    }),
});
exports.updateUserSchema = yup.object({
    displayName: yup
        .string()
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name must be less than 50 characters')
        .optional(),
    role: yup
        .string()
        .oneOf(['admin', 'professor', 'student'], 'Invalid role')
        .optional(),
    studentNumber: yup
        .string()
        .min(3, 'Student number must be at least 3 characters')
        .optional(),
    isActive: yup
        .boolean()
        .optional(),
});
exports.userQuerySchema = yup.object({
    role: yup
        .string()
        .oneOf(['admin', 'professor', 'student'], 'Invalid role')
        .optional(),
    isDeleted: yup
        .boolean()
        .optional(),
    includeDeleted: yup
        .boolean()
        .optional(),
    page: yup
        .number()
        .integer()
        .min(1, 'Page must be at least 1')
        .optional(),
    limit: yup
        .number()
        .integer()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit must be at most 100')
        .optional(),
});
//# sourceMappingURL=user.js.map