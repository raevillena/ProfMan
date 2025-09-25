import * as yup from 'yup';
export declare const createSubjectSchema: yup.ObjectSchema<{
    code: string;
    title: string;
    description: string | undefined;
    isReusable: boolean;
}, yup.AnyObject, {
    code: undefined;
    title: undefined;
    description: undefined;
    isReusable: true;
}, "">;
export declare const updateSubjectSchema: yup.ObjectSchema<{
    title: string | undefined;
    description: string | undefined;
    isReusable: boolean | undefined;
}, yup.AnyObject, {
    title: undefined;
    description: undefined;
    isReusable: undefined;
}, "">;
export declare const assignSubjectSchema: yup.ObjectSchema<{
    professorIds: string[];
}, yup.AnyObject, {
    professorIds: "";
}, "">;
export declare const subjectQuerySchema: yup.ObjectSchema<{
    isReusable: boolean | undefined;
    createdBy: string | undefined;
    page: number | undefined;
    limit: number | undefined;
}, yup.AnyObject, {
    isReusable: undefined;
    createdBy: undefined;
    page: undefined;
    limit: undefined;
}, "">;
export type CreateSubjectRequest = yup.InferType<typeof createSubjectSchema>;
export type UpdateSubjectRequest = yup.InferType<typeof updateSubjectSchema>;
export type AssignSubjectRequest = yup.InferType<typeof assignSubjectSchema>;
export type SubjectQueryRequest = yup.InferType<typeof subjectQuerySchema>;
//# sourceMappingURL=subject.d.ts.map