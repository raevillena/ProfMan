import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: Omit<User, 'passwordHash'>;
        }
    }
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const adminOnly: (req: Request, res: Response, next: NextFunction) => void;
export declare const professorOrAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const anyRole: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map