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
const AzureSessionStore = require('../middlewares/azure-session-storage');
function routes(app) {
    app.get("/api/security/sessions/cleanup", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let session_storage = new AzureSessionStore();
        let promise = session_storage.cleanup();
        promise.then(() => {
            res.send({ success: true });
        }).catch((err) => {
            res.send({ success: false, error: err });
        });
    }));
}
exports.routes = routes;
//# sourceMappingURL=security-routes.js.map