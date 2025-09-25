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
exports.subjectQuerySchema = exports.assignSubjectSchema = exports.updateSubjectSchema = exports.createSubjectSchema = void 0;
const yup = __importStar(require("yup"));
exports.createSubjectSchema = yup.object({
    code: yup
        .string()
        .min(2, 'Subject code must be at least 2 characters')
        .max(10, 'Subject code must be less than 10 characters')
        .matches(/^[A-Z0-9]+$/, 'Subject code must contain only uppercase letters and numbers')
        .required('Subject code is required'),
    title: yup
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
        .required('Title is required'),
    description: yup
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    isReusable: yup
        .boolean()
        .optional()
        .default(true),
});
exports.updateSubjectSchema = yup.object({
    title: yup
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
        .optional(),
    description: yup
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    isReusable: yup
        .boolean()
        .optional(),
});
exports.assignSubjectSchema = yup.object({
    professorIds: yup
        .array()
        .of(yup.string().required('Professor ID is required'))
        .min(1, 'At least one professor must be assigned')
        .required('Professor IDs are required'),
});
exports.subjectQuerySchema = yup.object({
    isReusable: yup
        .boolean()
        .optional(),
    createdBy: yup
        .string()
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
//# sourceMappingURL=subject.js.map