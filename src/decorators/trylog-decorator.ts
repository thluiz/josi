import { LoggerService } from "../services/logger-service";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";

export function trylog() {
    return function( target, method, descriptor ) {
        var originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            try {
                let result = originalMethod.apply(this, args);

                if(result && !result.success) {
                    LoggerService.error(target, new Error('Failed Result'), {
                        action: method,
                        args,
                        result
                    });
                }

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