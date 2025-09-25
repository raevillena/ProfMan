import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
export declare const validate: (schema: yup.AnySchema, property?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateBody: (schema: yup.AnySchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateQuery: (schema: yup.AnySchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateParams: (schema: yup.AnySchema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validation.d.ts.map