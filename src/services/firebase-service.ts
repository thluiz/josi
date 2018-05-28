import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';

import * as admin from 'firebase-admin';
import { AzureTableService } from './azure-tables-service';

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
    logError(error);
}
    
function logError(error) {
    let tbl = "ERROR";
    let tableSvc = AzureTableService.createTableService();
    AzureTableService.createTableIfNotExists(tableSvc, tbl, (err) => {
                
    });

    let entity = AzureTableService.buildEntity(
        new Date().getTime().toString(), 
        { error }, "ERROR");

    AzureTableService.insertOrMergeEntity(tableSvc, tbl, entity, function (err, results) {
        if (err) {
            console.log(err);
            console.log("AzureSessionStore.set: " + err);                        
        } else {            
            
        }
    });
}

export class FirebaseService {
    
    static emit_event(collection, event : { event_type: string, data: string | Error, time?:number }): Result {        
        try {                   
            if(!db) {
                logError("DB not set!!!");
                return;
            }

            var docRef = db.collection(collection).doc();
            event.time = event.time || (new Date()).getTime();
            docRef.set(event);

            return Result.Ok();    
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }        
    }
}