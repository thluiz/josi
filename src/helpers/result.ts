import { ErrorCode } from "./errors-codes";
import * as uuid from "uuid/v4";

export class SuccessResult<T = any> {
    public id : string;
    public success = true;

    public static GeneralOk<T>(data?: T): SuccessResult<T> {
        return new SuccessResult<T>("GENERIC_ACTION", data);
    }

    public static Ok<T>(type:string, data?: T): SuccessResult<T> {
        return new SuccessResult<T>(type, data);
    }

    private constructor(public type:string, public data: T, public message?: string) {
        this.id = uuid();
    }
}

export class ErrorResult {
    public id : string;
    public success = false;
    public message: string;

    public static Fail(code: ErrorCode, error: Error, inner_error?: ErrorResult): ErrorResult {
        return new ErrorResult(error, code, inner_error);
    }

    private constructor(public data: Error,
        public error_code: ErrorCode,
        public inner_error?: ErrorResult) {
        this.id = uuid();
        this.message = data.message;
    }
}

export type Result<T=any> = SuccessResult<T> | ErrorResult;
