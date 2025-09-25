import { Request, Response, NextFunction } from 'express';

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
};
