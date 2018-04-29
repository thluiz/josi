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
const security_service_1 = require("../services/security-service");
function routes(app) {
    app.get("/api/users/current", (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userReq = yield security_service_1.SecurityService.getUserFromRequest(request);
            const user = yield security_service_1.SecurityService.serializeUser(userReq);
            res.send(user);
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
}
exports.routes = routes;
//# sourceMappingURL=users-routes.js.map