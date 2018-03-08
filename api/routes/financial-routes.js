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
    app.get("/api/financial/accounts/:branch_id", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch_id', sql.Int, req.params.branch_id)
            .query(`select * 
                from account 
                where active = 1
                and branch_id = @branch_id
                order by [order] 
                for json path`, [req.params.branch_id]);
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
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=financial-routes.js.map