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
const auth = require("../../src/middlewares/auth");
const invitations_service_1 = require("../services/invitations-service");
function routes(app) {
    app.post("/api/invitations/change_type", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const indication_id = req.body.id;
        const new_type = req.body.type;
        let result = yield invitations_service_1.InvitationsService.change_invite_type(indication_id, new_type);
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=invitations-routes.js.map