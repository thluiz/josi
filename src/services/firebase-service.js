"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const trylog_decorator_1 = require("../decorators/trylog-decorator");
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
    logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.Firebase, error, "Initializing");
}
class FirebaseService {
    static get_token() {
        return __awaiter(this, void 0, void 0, function* () {
            let customToken = yield admin.auth().createCustomToken(process.env.FIREBASE_UID);
            return result_1.Result.GeneralOk(customToken);
        });
    }
    static emit_event(collection, event) {
        if (!db) {
            return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, new Error('DB not set- Error emitting event'));
        }
        var docRef = db.collection(collection).doc();
        event.time = event.time || (new Date()).getTime();
        event.data = JSON.stringify(event.data);
        docRef.set(event);
        return result_1.Result.GeneralOk();
    }
}
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FirebaseService, "get_token", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", result_1.Result)
], FirebaseService, "emit_event", null);
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase-service.js.map