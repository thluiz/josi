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
const incidents_repository_1 = require("../repositories/incidents-repository");
const auth = require("../../src/middlewares/auth");
const security_service_1 = require("../services/security-service");
const incidents_service_1 = require("../services/incidents-service");
const IR = incidents_repository_1.IncidentsRepository;
function routes(app) {
    app.get("/api/available_ownerships/:branch/:date/:type", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getAvailableOwnerships(req.params.branch, req.params.date, req.params.type);
        res.send(result);
    }));
    app.get("/api/current_activities/:branch?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getCurrentActivities(req.params.branch > 0 ? req.params.branch : null);
        res.send(result);
    }));
    app.get("/api/incidents/history/:person/:start_date/:end_date/:activity_type?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getPersonIncidentsHistory(req.params.person, req.params.start_date, req.params.end_date, req.params.activity_type);
        res.send(result);
    }));
    app.get("/api/incidents/:id", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getIncidentDetails(request.params.id);
        response.send(result);
    }));
    app.get("/api/agenda/:branch?/:date?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getAgenda(req.params.branch > 0 ? req.params.branch : null, req.params.date);
        res.send(result);
    }));
    app.get("/api/daily/:branch?/:display?/:display_modifier?", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getDailyMonitor(request.params.branch > 0 ? request.params.branch : null, request.params.display || 0, request.params.display_modifier || 0);
        response.send(result);
    }));
    app.get("/api/people_summary/:branch?/:week?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getPeopleSummary(req.params.branch > 0 ? req.params.branch : null, req.params.week || 0, req.params.date);
        res.send(result);
    }));
    app.get("/api/sumary/:branch?/:month?/:week?/:date?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield IR.getSummary(req.params.branch > 0 ? req.params.branch : null, req.params.month || 0, req.params.week || 0, req.params.date);
        res.send(result);
    }));
    app.post("/api/incident/close", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        console.log(req.body);
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incidents_service_1.IncidentsService.close_incident({
            id: req.body.id,
            close_text: req.body.close_text,
            title: req.body.title,
            payment_method_id: req.body.payment_method_id
        }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/start", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incidents_service_1.IncidentsService.start_incident({ id: req.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/reopen", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incidents_service_1.IncidentsService.reopen_incident({ id: req.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/start/cancel", auth.ensureLoggedIn(), (req, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield incidents_service_1.IncidentsService.cancel_start_incident({ id: req.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/remove", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(request);
        let result = yield incidents_service_1.IncidentsService.remove_incident({ id: request.body.id }, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/reschedule", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(request);
        let result = yield incidents_service_1.IncidentsService.reschedule_incident(request.body.incident, request.body.new_incident, request.body.contact.contact_text, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/register_incident", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(request);
        let result = yield incidents_service_1.IncidentsService.register_incident(request.body.incident, yield user.getPersonId());
        response.send(result);
    }));
    app.post("/api/incident/register_contact", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(request);
        let result = yield incidents_service_1.IncidentsService.register_contact_for_incident(request.body.incident, request.body.contact.contact_text, yield user.getPersonId());
        response.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=incidents-routes.js.map