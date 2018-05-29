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
const auth = require("../../../src/middlewares/auth");
const firebase_service_1 = require("../../services/firebase-service");
function routes(app) {
    app.get("/api/firebase/token", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield firebase_service_1.FirebaseService.get_token();
        res.send(result);
    }));
    app.get("/api/firebase/current_time", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const dt = new Date();
        res.send({
            milliseconds: dt.getTime(),
            date: dt
        });
    }));
}
exports.routes = routes;
//# sourceMappingURL=firebase-routes.js.map