"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_1 = require("../services/logger-service");
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
function trylog() {
    return function (target, method, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            try {
                return originalMethod.apply(this, args);
            }
            catch (error) {
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.GenericError, error, {
                    action: method,
                    target,
                    args
                });
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        };
        return descriptor;
    };
}
exports.trylog = trylog;
function trylog2() {
    return function (target, method, descriptor) {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            try {
                let result = originalMethod.apply(this, args);
                return result;
            }
            catch (error) {
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.GenericError, error, {
                    action: method,
                    target,
                    args
                });
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        };
        return descriptor;
    };
}
exports.trylog2 = trylog2;
//# sourceMappingURL=trylog-decorator.js.map