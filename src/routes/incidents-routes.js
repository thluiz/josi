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
const incidents_repository_1 = require("./../repository/incidents-repository");
const auth = require("../../src/middlewares/auth");
const IR = incidents_repository_1.IncidentsRepository;
function routes(app) {
    app.get("/api/incidents/history/:person/:activity_type/:page?", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getPersonIncidentsHistory(request.params.person, request.params.activity_type, request.params.page > 0 ? request.params.page : 1);
        response.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=incidents-routes.js.map