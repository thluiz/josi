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
const sql = require("mssql");
const incident_services_1 = require("../../domain/services/incident_services");
const auth = require("../../src/middlewares/auth");
const security_service_1 = require("../../src/services/security-service");
const result_1 = require("../../src/helpers/result");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const incident_service = new incident_services_1.IncidentService(pool);
    /**
     * COMMENTS
     */
    app.get("/api/incident_comments/incident/:id/:show_archived?", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input('incident_id', sql.Int, request.params.id)
                .input('show_archived', sql.Int, request.params.show_archived || 0)
                .execute(`GetIncidentComments`);
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }));
    app.post("/api/incident_comments", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(request);
        console.log(user);
        let result = yield incident_service.save_comment(request.body.incident_id, request.body.comment, yield user.getPersonId());
        res.send(result_1.Result.Ok("INCIDENT_COMMENT_ADDED", [result.recordset[0][0]]));
    }));
    app.post("/api/incident_comments/archive", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.archive_comment(request.body.id);
        res.send(result_1.Result.Ok("INCIDENT_COMMENT_ARCHIVED", [result.recordset[0][0]]));
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=incidents-routes.js.map