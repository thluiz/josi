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
    app.get("/api/branches/:id?", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (!req.params.id) {
            const result = yield new sql.Request(pool)
                .execute(`GetBranches`);
            res.send(result.recordset[0]);
        }
        else {
            const result = yield new sql.Request(pool)
                .input("branch", sql.Int, req.params.id)
                .query(`select * from vwBranch where id = @branch for json path`);
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);
        }
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
    app.get("/api/countries", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [country] order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
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
    app.get("/api/locations", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [location] where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/payment_methods", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from payment_method where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/acquirers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from acquirer where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    /**
     * UPDATES
     */
    app.post("/api/branches", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const branch = req.body.branch;
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, branch.id)
            .input('name', sql.VarChar(100), branch.name)
            .input('abrev', sql.VarChar(100), branch.abrev)
            .input('initials', sql.VarChar(3), branch.initials)
            .query(`update branch set
                    name = @name,
                    abrev = @abrev,
                    initials = @initials
                where id = @id`);
        res.send({ sucess: true });
    }));
    app.post("/api/payment_methods", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const payment_method = req.body.payment_method;
        if (payment_method.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, payment_method.id)
                .input('name', sql.VarChar(100), payment_method.name)
                .input('order', sql.Int, payment_method.order)
                .query(`update payment_method set
                        name = @name,
                        [order] = @order
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), payment_method.name)
                .input('order', sql.Int, payment_method.order)
                .query(`insert into payment_method (name, [order])
                    values (@name, @order)`);
        }
        res.send({ sucess: true });
    }));
    app.post("/api/acquirers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const acquirer = req.body.acquirer;
        if (acquirer.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, acquirer.id)
                .input('name', sql.VarChar(100), acquirer.name)
                .input('order', sql.Int, acquirer.order)
                .query(`update acquirer set
                        name = @name,
                        [order] = @order
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), acquirer.name)
                .input('order', sql.Int, acquirer.order)
                .query(`insert into acquirer (name, [order])
                    values (@name, @order)`);
        }
        res.send({ sucess: true });
    }));
    app.post("/api/branches_acquirers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch_id', sql.Int, req.body.branch_id)
            .input('acquirer_id', sql.Int, req.body.acquirer_id)
            .execute(`ToggleBranchAcquirerAssociation`);
        res.send({ sucess: true });
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=parameters-routes.js.map