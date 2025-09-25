import * as yup from 'yup'

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

// Register validation schema
export const registerSchema = yup.object({
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
})

// Change password validation schema
export const changePasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(6, 'New password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'New password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('New password is required'),
})

export type LoginFormData = yup.InferType<typeof loginSchema>
export type RegisterFormData = yup.InferType<typeof registerSchema>
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>
