import { ErrorCode } from "./errors-codes";

export class Result<T = any> {
    public static Ok<T>(data?: T): Result<T> {
        return new Result<T>(true, data);
    }

    public static Fail<T>(code: ErrorCode, error: Error, message?: string, data?: T): Result<T> {
        return new Result<T>(false, data, error, message);
    }

    private constructor(public success: boolean, public data: T, public error?: Error, public message?: string) {
        
    }
}
