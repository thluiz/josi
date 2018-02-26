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
const security_services_1 = require("../../domain/services/security_services");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    app.get("/api/branches", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetBranches`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/domains", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetDomains`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/programs", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPrograms`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/kf_families", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetKungFuFamilies`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/recurrence_types", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRecurrenceTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/incident_types", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetIncidentTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/contact_types", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetContactTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/roles", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRoles`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/groups", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [group] where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=parameters-routes.js.map