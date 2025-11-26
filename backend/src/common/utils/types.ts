export type SuccessResponse<T> = {
    ok: true;
    msg: string;
    data?: T;
}

export enum Environment {
    DEV = 'development',
    PROD = 'production',
    TEST = 'test',
}