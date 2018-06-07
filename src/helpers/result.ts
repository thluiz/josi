import { ErrorCode } from "./errors-codes";
import * as uuid from "uuid/v4";

export class Result<T = any> {
    public id : string;
    
    public static GeneralOk<T>(data?: T): Result<T> {
        return new Result<T>(true, "GENERIC_ACTION", data);
    }

    public static Ok<T>(type:string, data?: T): Result<T> {
        return new Result<T>(true, type, data);
    }

    public static Fail<T>(code: ErrorCode, error: Error, message?: string, data?: T): Result<T> {
        return new Result<T>(false, 'Fail', data, error, message || error != null? error.message : null, code);
    }

    private constructor(public success: boolean, public type:string, public data: T|Error, public error?: Error, public message?: string, public error_code?: ErrorCode) {        
        this.id = uuid();
    }
}
