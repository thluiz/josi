import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';

import * as admin from 'firebase-admin';
import { LoggerService, ErrorOrigins } from './logger-service';
import { trylog } from '../decorators/trylog-decorator';

let db = null;
try {
    admin.initializeApp({
        credential: admin.credential.cert(
            {
                "type": "service_account",
                "project_id": process.env.FIREBASE_PROJECT_ID,
                "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
                "private_key": process.env.FIREBASE_PRIVATE_KEY.split("\\n").join("\n"),
                "client_email": process.env.FIREBASE_CLIENT_EMAIL,
                "client_id": process.env.FIREBASE_CLIENT_ID,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://accounts.google.com/o/oauth2/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
            } as any
        )    
    });

    db = admin.firestore();
} catch(error) {        
    LoggerService.error(ErrorOrigins.Firebase, error, "Initializing");
}
    
export class FirebaseService {
    @trylog()
    static async get_token() : Promise<Result<string>> {        
        let customToken = await admin.auth().createCustomToken(process.env.FIREBASE_UID);    

        return Result.Ok(customToken);        
    }

    @trylog()
    static emit_event(collection, event : { type: string, data: string | Error, time?:number }): Result {                
        if(!db) {
            return Result.Fail(ErrorCode.GenericError, new Error('DB not set- Error emitting event'));
        }

        var docRef = db.collection(collection).doc();
        event.time = event.time || (new Date()).getTime();
        docRef.set(event);
        
        return Result.Ok();                    
    }
}