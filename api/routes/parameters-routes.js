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
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    app.get("/api/branches", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetBranches`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/domains", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetDomains`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/programs", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPrograms`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/kf_families", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetKungFuFamilies`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/recurrence_types", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRecurrenceTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/incident_types", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetIncidentTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/contact_types", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetContactTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/roles", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRoles`);
        response.send(result.recordset[0]);
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=parameters-routes.js.map