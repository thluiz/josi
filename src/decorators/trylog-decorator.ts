import { LoggerService } from "../services/logger-service";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";

export function trylog() {
    return function( target, method, descriptor ) {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            try {
                let result = originalMethod.apply(this, args);

                return result;
            } catch (error) {

                LoggerService.error(target, error, {
                    action: method,
                    args
                });
                
                return Result.Fail(ErrorCode.GenericError, error);       
            }            
        };

        return descriptor;
    }
}