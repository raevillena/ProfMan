import { Request, Response } from 'express';
export declare class QuizController {
    private quizService;
    constructor();
    getQuizzes(req: Request, res: Response): Promise<void>;
    getQuizById(req: Request, res: Response): Promise<void>;
    createQuiz(req: Request, res: Response): Promise<void>;
    updateQuiz(req: Request, res: Response): Promise<void>;
    deleteQuiz(req: Request, res: Response): Promise<void>;
    restoreQuiz(req: Request, res: Response): Promise<void>;
    permanentlyDeleteQuiz(req: Request, res: Response): Promise<void>;
    getQuizzesByBranch(req: Request, res: Response): Promise<void>;
    submitQuizAttempt(req: Request, res: Response): Promise<void>;
    getQuizAttemptsByStudent(req: Request, res: Response): Promise<void>;
    getQuizAttemptsByQuiz(req: Request, res: Response): Promise<void>;
    getBestQuizAttempt(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=quizController.d.ts.map