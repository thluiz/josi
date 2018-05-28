"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
const admin = require("firebase-admin");
let db = null;
try {
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": "service_account",
            "project_id": process.env.FIREBASE_PROJECT_ID,
            "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
            "client_email": process.env.FIREBASE_CLIENT_EMAIL,
            "client_id": process.env.FIREBASE_CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://accounts.google.com/o/oauth2/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
        })
    });
    db = admin.firestore();
}
catch (error) {
    console.log("ERROR TRYING TO CONNECT TO FIREBASE!");
    console.log(error);
}
class FirebaseService {
    static emit_event(collection, event) {
        try {
            if (!db) {
                return;
            }
            var docRef = db.collection(collection).doc();
            event.time = event.time || (new Date()).getTime();
            docRef.set(event);
            return result_1.Result.Ok();
        }
        catch (error) {
            return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
        }
    }
}
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase-service.js.map