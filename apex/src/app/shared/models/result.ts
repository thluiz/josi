export enum ErrorCode {
    NothingChanged = 5    
}

export class Result<T = any> {    
    public id : string;    
    public time : number;
    public error_code : ErrorCode;
    public static Ok<T>(data?: T, type = "Generic"): Result<T> {        
        return new Result<T>(true, data);
    }

    public static Fail<T>(error: Error, message?: string, data?: T, type = "Generic"): Result<T> {
        return new Result<T>(false, data, error, message, type);
    }

    private constructor(public success: boolean, public data: T, public error?: Error, public message?: string, public type: string = "Generic") {
        this.time = new Date().getTime();
        this.id = this.time.toString();
    }
}
