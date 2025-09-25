import * as yup from 'yup';
export declare const loginSchema: yup.ObjectSchema<{
    email: string;
    password: string;
}, yup.AnyObject, {
    email: undefined;
    password: undefined;
}, "">;
export declare const registerSchema: yup.ObjectSchema<{
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
export declare const changePasswordSchema: yup.ObjectSchema<{
    oldPassword: string;
    newPassword: string;
}, yup.AnyObject, {
    oldPassword: undefined;
    newPassword: undefined;
}, "">;
export declare const studentAutoCreateSchema: yup.ObjectSchema<{
    email: string;
    studentNumber: string;
}, yup.AnyObject, {
    email: undefined;
    studentNumber: undefined;
}, "">;
export type LoginRequest = yup.InferType<typeof loginSchema>;
export type RegisterRequest = yup.InferType<typeof registerSchema>;
export type ChangePasswordRequest = yup.InferType<typeof changePasswordSchema>;
export type StudentAutoCreateRequest = yup.InferType<typeof studentAutoCreateSchema>;
//# sourceMappingURL=auth.d.ts.map