import { FirebaseService } from "../services/firebase-service";
import { Result } from "../helpers/result";

export function firebaseEmitter(collection) {
    return function( target, method, descriptor ) {
        var originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            let result : Result = await originalMethod.apply(this, args);

            if(result.success) {
                FirebaseService.emit_event(collection, {                    
                    id: result.id,
                    data: result
                });            
            }

            return result;
        };

        return descriptor;
    }
}