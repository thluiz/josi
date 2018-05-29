import { FirebaseService } from "../services/firebase-service";
import { Result } from "../helpers/result";

export function firebaseEmitter(collection, type) {
    return function( target, method, descriptor ) {
        var originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            let result : Result = await originalMethod.apply(this, args);

            console.log(result);

            if(result.success) {
                FirebaseService.emit_event(collection, {
                    type, data: JSON.stringify(result.data)
                });            
            }

            return result;
        };

        return descriptor;
    }
}

export function firebaseMultipleEmitter(collection, type) {
    return function( target, method, descriptor ) {
        var originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            let result : Result = await originalMethod.apply(this, args);

            if(result.success) {
                (result.data as any[]).forEach(element => {
                    FirebaseService.emit_event(collection, {
                        type, data: JSON.stringify(result.data)
                    });    
                });                            
            }

            return result;
        };

        return descriptor;
    }
}