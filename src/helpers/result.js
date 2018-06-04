"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
class Result {
    constructor(success, type, data, error, message, error_code) {
        this.success = success;
        this.type = type;
        this.data = data;
        this.error = error;
        this.message = message;
        this.error_code = error_code;
        this.id = uuid();
    }
    static GeneralOk(data) {
        return new Result(true, "GENERIC_ACTION", data);
    }
    static Ok(type, data) {
        return new Result(true, type, data);
    }
    static Fail(code, error, message, data) {
        return new Result(false, 'Fail', data, error, message, code);
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map