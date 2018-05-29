"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
const admin = require("firebase-admin");
const logger_service_1 = require("./logger-service");
let db = null;
try {
    admin.initializeApp({
        credential: admin.credential.cert({
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
        })
    });
    db = admin.firestore();
}
catch (error) {
    logger_service_1.LoggerService.error(logger_service_1.ErrorOrigins.Firebase, error, "Initializing");
}
class FirebaseService {
    static get_token() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let customToken = yield admin.auth().createCustomToken(process.env.FIREBASE_UID);
                return result_1.Result.Ok(customToken);
            }
            catch (error) {
                logger_service_1.LoggerService.error(logger_service_1.ErrorOrigins.Firebase, error, "Getting Token");
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static emit_event(collection, event) {
        try {
            console.log('emitting');
            if (!db) {
                logger_service_1.LoggerService.error(logger_service_1.ErrorOrigins.Firebase, new Error("DB not set!!!"));
                return;
            }
            var docRef = db.collection(collection).doc();
            event.time = event.time || (new Date()).getTime();
            docRef.set(event);
            console.log('emitted!');
            return result_1.Result.Ok();
        }
        catch (error) {
            logger_service_1.LoggerService.error(logger_service_1.ErrorOrigins.Firebase, error, "Emitting event");
            return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
        }
    }
}
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase-service.js.map