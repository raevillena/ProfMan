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
exports.submitQuizSchema = exports.updateQuizSchema = exports.createQuizSchema = exports.quizQuestionSchema = void 0;
const yup = __importStar(require("yup"));
exports.quizQuestionSchema = yup.object({
    type: yup
        .string()
        .oneOf(['mcq', 'multi', 'numeric', 'short-text'], 'Invalid question type')
        .required('Question type is required'),
    question: yup
        .string()
        .min(5, 'Question must be at least 5 characters')
        .max(500, 'Question must be less than 500 characters')
        .required('Question is required'),
    options: yup
        .array()
        .of(yup.string().required('Option is required'))
        .when('type', {
        is: (val) => ['mcq', 'multi'].includes(val),
        then: (schema) => schema.min(2, 'At least 2 options are required for MCQ/multi-choice questions'),
        otherwise: (schema) => schema.optional(),
    }),
    correctAnswer: yup
        .mixed()
        .required('Correct answer is required'),
    points: yup
        .number()
        .positive('Points must be positive')
        .required('Points are required'),
    tolerance: yup
        .number()
        .positive('Tolerance must be positive')
        .when('type', {
        is: 'numeric',
        then: (schema) => schema.required('Tolerance is required for numeric questions'),
        otherwise: (schema) => schema.optional(),
    }),
    partialCredit: yup
        .boolean()
        .when('type', {
        is: 'multi',
        then: (schema) => schema.optional().default(false),
        otherwise: (schema) => schema.optional(),
    }),
});
exports.createQuizSchema = yup.object({
    branchId: yup
        .string()
        .required('Branch ID is required'),
    weekNumber: yup
        .number()
        .integer()
        .min(1, 'Week number must be at least 1')
        .max(15, 'Week number must be at most 15')
        .required('Week number is required'),
    title: yup
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
        .required('Title is required'),
    description: yup
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    questions: yup
        .array()
        .of(exports.quizQuestionSchema)
        .min(1, 'At least one question is required')
        .required('Questions are required'),
    timeLimit: yup
        .number()
        .integer()
        .min(1, 'Time limit must be at least 1 minute')
        .max(180, 'Time limit must be at most 180 minutes')
        .optional(),
    autoGrade: yup
        .boolean()
        .optional()
        .default(true),
});
exports.updateQuizSchema = yup.object({
    title: yup
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters')
        .optional(),
    description: yup
        .string()
        .max(500, 'Description must be less than 500 characters')
        .optional(),
    questions: yup
        .array()
        .of(exports.quizQuestionSchema)
        .min(1, 'At least one question is required')
        .optional(),
    timeLimit: yup
        .number()
        .integer()
        .min(1, 'Time limit must be at least 1 minute')
        .max(180, 'Time limit must be at most 180 minutes')
        .optional(),
    autoGrade: yup
        .boolean()
        .optional(),
    isActive: yup
        .boolean()
        .optional(),
});
exports.submitQuizSchema = yup.object({
    answers: yup
        .object()
        .required('Answers are required'),
});
//# sourceMappingURL=quiz.js.map