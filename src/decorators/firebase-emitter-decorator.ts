import { FirebaseManager } from "../services/managers/firebase-manager";
import { Result } from "../helpers/result";

export function firebaseEmitter(collection) {
    return function( target, method, descriptor ) {
        var originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            let result : Result = await originalMethod.apply(this, args);
            if(result.success && process.env.FIREBASE_EMIT_EVENTS !== "false") {
                await FirebaseManager.emit_event(collection, {
                    id: result.id,
                    data: result
                });
            }

            return result;
        };

        return descriptor;
    }
}