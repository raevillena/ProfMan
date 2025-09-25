import * as yup from 'yup';
export declare const createUserSchema: yup.ObjectSchema<{
    email: string;
    password: string;
    displayName: string;
    role: NonNullable<"admin" | "professor" | "student" | undefined>;
    studentNumber: string | undefined;
}, yup.AnyObject, {
    email: undefined;
    password: undefined;
    displayName: undefined;
    role: undefined;
    studentNumber: undefined;
}, "">;
export declare const updateUserSchema: yup.ObjectSchema<{
    displayName: string | undefined;
    role: "admin" | "professor" | "student" | undefined;
    studentNumber: string | undefined;
    isActive: boolean | undefined;
}, yup.AnyObject, {
    displayName: undefined;
    role: undefined;
    studentNumber: undefined;
    isActive: undefined;
}, "">;
export declare const userQuerySchema: yup.ObjectSchema<{
    role: "admin" | "professor" | "student" | undefined;
    isDeleted: boolean | undefined;
    includeDeleted: boolean | undefined;
    page: number | undefined;
    limit: number | undefined;
}, yup.AnyObject, {
    role: undefined;
    isDeleted: undefined;
    includeDeleted: undefined;
    page: undefined;
    limit: undefined;
}, "">;
export type CreateUserRequest = yup.InferType<typeof createUserSchema>;
export type UpdateUserRequest = yup.InferType<typeof updateUserSchema>;
export type UserQueryRequest = yup.InferType<typeof userQuerySchema>;
//# sourceMappingURL=user.d.ts.map