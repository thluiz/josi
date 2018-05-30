"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
class Result {
    constructor(success, type, data, error, message) {
        this.success = success;
        this.type = type;
        this.data = data;
        this.error = error;
        this.message = message;
        this.id = uuid();
    }
    static GeneralOk(data) {
        return new Result(true, "GENERIC_ACTION", data);
    }
    static Ok(type, data) {
        return new Result(true, type, data);
    }
    static Fail(code, error, message, data) {
        return new Result(false, 'Fail', data, error, message);
    }
}
exports.Result = Result;
//# sourceMappingURL=result.js.map