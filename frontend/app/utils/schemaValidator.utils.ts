import { ZodObject } from "zod";


export const SchemaValidator = <T extends ZodObject<any>>(schema: T, data: any):{msg:string,path:string}[] | true => {
    const validate = schema.safeParse(data)

    if (!validate.success) {
        return validate.error.issues.map(issue => ({
            msg: issue.message,
            path: issue.path.join('.')
        }))
    }
    return true
}