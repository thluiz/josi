"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
class SuccessResult {
    constructor(type, data, message) {
        this.type = type;
        this.data = data;
        this.message = message;
        this.success = true;
        this.id = uuid();
    }
    static GeneralOk(data) {
        return new SuccessResult("GENERIC_ACTION", data);
    }
    static Ok(type, data) {
        return new SuccessResult(type, data);
    }
}
exports.SuccessResult = SuccessResult;
class ErrorResult {
    constructor(data, error_code, inner_error) {
        this.data = data;
        this.error_code = error_code;
        this.inner_error = inner_error;
        this.success = false;
        this.id = uuid();
        this.message = data.message;
    }
    static Fail(code, error, inner_error) {
        return new ErrorResult(error, code, inner_error);
    }
}
exports.ErrorResult = ErrorResult;
//# sourceMappingURL=result.js.map