import * as yup from 'yup';

// Create subject validation schema
export const createSubjectSchema = yup.object({
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

// Update subject validation schema
export const updateSubjectSchema = yup.object({
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

// Assign subject validation schema
export const assignSubjectSchema = yup.object({
  professorIds: yup
    .array()
    .of(yup.string().required('Professor ID is required'))
    .min(1, 'At least one professor must be assigned')
    .required('Professor IDs are required'),
});

// Subject query parameters validation
export const subjectQuerySchema = yup.object({
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

export type CreateSubjectRequest = yup.InferType<typeof createSubjectSchema>;
export type UpdateSubjectRequest = yup.InferType<typeof updateSubjectSchema>;
export type AssignSubjectRequest = yup.InferType<typeof assignSubjectSchema>;
export type SubjectQueryRequest = yup.InferType<typeof subjectQuerySchema>;
