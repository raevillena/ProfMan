import * as yup from 'yup';

// Quiz question validation schema
export const quizQuestionSchema = yup.object({
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
      is: (val: string) => ['mcq', 'multi'].includes(val),
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

// Create quiz validation schema
export const createQuizSchema = yup.object({
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
    .of(quizQuestionSchema)
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

// Update quiz validation schema
export const updateQuizSchema = yup.object({
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
    .of(quizQuestionSchema)
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

// Submit quiz validation schema
export const submitQuizSchema = yup.object({
  answers: yup
    .object()
    .required('Answers are required'),
});

export type QuizQuestionRequest = yup.InferType<typeof quizQuestionSchema>;
export type CreateQuizRequest = yup.InferType<typeof createQuizSchema>;
export type UpdateQuizRequest = yup.InferType<typeof updateQuizSchema>;
export type SubmitQuizRequest = yup.InferType<typeof submitQuizSchema>;
