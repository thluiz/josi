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
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const incident_service = new incident_services_1.IncidentService(pool);
    app.post("/api/incident/close", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incident_service.close_incident(req.body.incident, yield user.getPersonId());
        response.send({ sucess: true });
    }));
    app.post("/api/incident/start", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incident_service.start_incident(req.body.incident, yield user.getPersonId());
        response.send({ sucess: true });
    }));
    app.post("/api/incident/reopen", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incident_service.reopen_incident(req.body.incident, yield user.getPersonId());
        response.send({ sucess: true });
    }));
    app.post("/api/incident/start/cancel", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incident_service.cancel_start_incident(req.body.incident, yield user.getPersonId());
        response.send({ sucess: true });
    }));
    app.post("/api/incident/remove", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.remove_incident(request.body.incident);
        response.send({ sucess: true });
    }));
    app.post("/api/incident/reschedule", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.reschedule_incident(request.body.incident, request.body.new_incident, request.body.contact.contact_text);
        response.send({ sucess: true });
    }));
    app.post("/api/incident/register_incident", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.register_incident(request.body.incident);
        response.send({ sucess: true });
    }));
    app.post("/api/incident/register_contact", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.register_contact_for_incident(request.body.incident, request.body.contact.contact_text);
        response.send({ sucess: true });
    }));
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
        let result = yield incident_service.save_comment(request.body.incident_id, request.body.comment);
        res.send(result.recordset[0][0]);
    }));
    app.post("/api/incident_comments/archive", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.archive_comment(request.body.id);
        res.send(result.recordset[0][0]);
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=incidents-routes.js.map