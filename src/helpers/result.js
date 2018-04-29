"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Result {
    constructor(success, data, error, message) {
        this.success = success;
        this.data = data;
        this.error = error;
        this.message = message;
    }
    static Ok(data) {
        return new Result(true, data);
    }
    static Fail(code, error, message, data) {
        return new Result(false, data, error, message);
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map