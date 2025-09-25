import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

// Generic validation middleware factory
export const validate = (schema: yup.AnySchema, property: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req[property];
      await schema.validate(data, { abortEarly: false });
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = error.inner.map((err) => ({
          field: err.path || 'unknown',
          message: err.message,
        }));

        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errors,
          },
        });
        return;
      }

      console.error('Validation error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Validation failed',
        },
      });
    }
  };
};

// Body validation middleware
export const validateBody = (schema: yup.AnySchema) => validate(schema, 'body');

// Query validation middleware
export const validateQuery = (schema: yup.AnySchema) => validate(schema, 'query');

// Params validation middleware
export const validateParams = (schema: yup.AnySchema) => validate(schema, 'params');
