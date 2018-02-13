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
const card_services_1 = require("../../domain/services/card_services");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const card_service = new card_services_1.CardService(pool);
    app.get("/api/organizations", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetOrganizations`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/person_card_positions", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from person_card_position where active = 1 for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/operators", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * 
                from vwPerson v 
                where is_operator = 1 or is_director = 1 or is_manager = 1 
                order by name for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/organizations/:id", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("organization_id", sql.Int, req.params.id)
            .execute(`GetOrganizations`);
        let response = result.recordset[0][0];
        res.send(response);
    }));
    app.post("/api/person_cards", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield card_service.save_person_card(req.body.person_card);
        res.send({ sucess: true });
    }));
    app.post("/api/person_cards/delete", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield card_service.remove_person_card(req.body.person_card);
        res.send({ sucess: true });
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=cards-routes.js.map