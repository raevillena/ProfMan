import * as yup from 'yup';
export declare const quizQuestionSchema: yup.ObjectSchema<{
    type: NonNullable<"numeric" | "mcq" | "multi" | "short-text" | undefined>;
    question: string;
    options: string[] | undefined;
    correctAnswer: {};
    points: number;
    tolerance: number | undefined;
    partialCredit: boolean | undefined;
}, yup.AnyObject, {
    type: undefined;
    question: undefined;
    options: "";
    correctAnswer: undefined;
    points: undefined;
    tolerance: undefined;
    partialCredit: undefined;
}, "">;
export declare const createQuizSchema: yup.ObjectSchema<{
    branchId: string;
    weekNumber: number;
    title: string;
    description: string | undefined;
    questions: {
        options?: string[] | undefined;
        tolerance?: number | undefined;
        partialCredit?: boolean | undefined;
        type: NonNullable<"numeric" | "mcq" | "multi" | "short-text" | undefined>;
        question: string;
        correctAnswer: {};
        points: number;
    }[];
    timeLimit: number | undefined;
    autoGrade: boolean;
}, yup.AnyObject, {
    branchId: undefined;
    weekNumber: undefined;
    title: undefined;
    description: undefined;
    questions: "";
    timeLimit: undefined;
    autoGrade: true;
}, "">;
export declare const updateQuizSchema: yup.ObjectSchema<{
    title: string | undefined;
    description: string | undefined;
    questions: {
        options?: string[] | undefined;
        tolerance?: number | undefined;
        partialCredit?: boolean | undefined;
        type: NonNullable<"numeric" | "mcq" | "multi" | "short-text" | undefined>;
        question: string;
        correctAnswer: {};
        points: number;
    }[] | undefined;
    timeLimit: number | undefined;
    autoGrade: boolean | undefined;
    isActive: boolean | undefined;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    questions: "";
    timeLimit: undefined;
    autoGrade: undefined;
    isActive: undefined;
}, "">;
export declare const submitQuizSchema: yup.ObjectSchema<{
    answers: {};
}, yup.AnyObject, {
    answers: {};
}, "">;
export type QuizQuestionRequest = yup.InferType<typeof quizQuestionSchema>;
export type CreateQuizRequest = yup.InferType<typeof createQuizSchema>;
export type UpdateQuizRequest = yup.InferType<typeof updateQuizSchema>;
export type SubmitQuizRequest = yup.InferType<typeof submitQuizSchema>;
//# sourceMappingURL=quiz.d.ts.map