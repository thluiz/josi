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
    app.get("/api/financial/accounts/:branch_id?", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch_id', sql.Int, req.params.branch_id || null)
            .query(`select a.*, isnull(b.abrev, 'Gestão Integrada') branch, isnull(b.initials, 'GI') branch_initials 
                from account a
                    left join branch b on b.id = a.branch_id
                where a.active = 1
                and a.branch_id = isnull(@branch_id, branch_id)
                order by [order] 
                for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/financial_board/expected_payments/:account", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("account_id", sql.Int, req.params.account)
            .input("start_date", sql.VarChar(10), req.query.start || null)
            .input("end_date", sql.VarChar(10), req.query.end || null)
            .execute(`GetPaymentsInPeriod`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/financial_board/account_status/:account", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("account_id", sql.Int, req.params.account)
            .input("start_date", sql.VarChar(10), req.query.start || null)
            .input("end_date", sql.VarChar(10), req.query.end || null)
            .execute(`GetAccountStatusInPeriod`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/financial_board/missing_payments/:account", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("account_id", sql.Int, req.params.account)
            .execute(`GetMissingPayments`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.post("/api/financial/accounts", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const account = req.body.account;
        if (account.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, account.id)
                .input('name', sql.VarChar(100), account.name)
                .input('order', sql.Int, account.order)
                .query(`update account set
                        name = @name,
                        [order] = @order
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), account.name)
                .input('order', sql.Int, account.order)
                .input('branch', sql.Int, account.branch_id > 0 ? account.branch_id : null)
                .query(`insert into account (name, [order], branch_id, active)
                    values (@name, @order, @branch, 1)`);
        }
        res.send({ sucess: true });
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=financial-routes.js.map