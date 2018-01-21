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
const incident_services_1 = require("../../domain/services/incident_services");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const incident_service = new incident_services_1.IncidentService(pool);
    app.post("/api/incident/close", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.close_incident(request.body.incident);
        response.send("Ok");
    }));
    app.post("/api/incident/start", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.start_incident(request.body.incident);
        response.send("Ok");
    }));
    app.post("/api/incident/start/cancel", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.cancel_start_incident(request.body.incident);
        response.send("Ok");
    }));
    app.post("/api/incident/remove", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.remove_incident(request.body.incident);
        response.send("Ok");
    }));
    app.post("/api/incident/reschedule", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.reschedule_incident(request.body.incident, request.body.new_incident, request.body.contact.contact_text);
        response.send("Ok");
    }));
    app.post("/api/incident/register_incident", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        console.log(request.body.incident);
        let result = yield incident_service.register_incident(request.body.incident);
        response.send("Ok");
    }));
    app.post("/api/incident/register_contact", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield incident_service.register_contact_for_incident(request.body.incident, request.body.contact.contact_text);
        response.send("Ok");
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=incidents-routes.js.map