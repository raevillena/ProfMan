import * as yup from 'yup';

// Create user validation schema
export const createUserSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
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

// Update user validation schema
export const updateUserSchema = yup.object({
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

// User query parameters validation
export const userQuerySchema = yup.object({
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

export type CreateUserRequest = yup.InferType<typeof createUserSchema>;
export type UpdateUserRequest = yup.InferType<typeof updateUserSchema>;
export type UserQueryRequest = yup.InferType<typeof userQuerySchema>;
