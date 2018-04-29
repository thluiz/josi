"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sql = require("mssql");
var security_services_1 = require("../../domain/services/security_services");
function configure_routes(app, connection_pool) {
    var _this = this;
    var pool = connection_pool;
    app.get("/api/financial/accounts/:branch_id?", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('branch_id', sql.Int, req.params.branch_id || null)
                        .query("select a.*, isnull(b.abrev, 'Gest\u00E3o Integrada') branch, isnull(b.initials, 'GI') branch_initials \n                from account a\n                    left join branch b on b.id = a.branch_id\n                where a.active = 1\n                and isnull(a.branch_id, -1) = isnull(@branch_id, isnull(a.branch_id, -1))\n                order by [order] \n                for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/financial_board/expected_payments/:account", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("account_id", sql.Int, req.params.account)
                        .input("start_date", sql.VarChar(10), req.query.start || null)
                        .input("end_date", sql.VarChar(10), req.query.end || null)
                        .execute("GetPaymentsInPeriod")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/financial_board/account_status/:account", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("account_id", sql.Int, req.params.account)
                        .input("start_date", sql.VarChar(10), req.query.start || null)
                        .input("end_date", sql.VarChar(10), req.query.end || null)
                        .execute("GetAccountStatusInPeriod")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/financial_board/missing_payments/:account", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("account_id", sql.Int, req.params.account)
                        .execute("GetMissingPayments")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/financial/accounts", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var account, result, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    account = req.body.account;
                    if (!(account.id > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, account.id)
                            .input('name', sql.VarChar(100), account.name)
                            .input('order', sql.Int, account.order)
                            .query("update account set\n                        name = @name,\n                        [order] = @order\n                    where id = @id")];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new sql.Request(pool)
                        .input('name', sql.VarChar(100), account.name)
                        .input('order', sql.Int, account.order)
                        .input('branch', sql.Int, account.branch_id > 0 ? account.branch_id : null)
                        .query("insert into account (name, [order], branch_id, active)\n                    values (@name, @order, @branch, 1)")];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=financial-routes.js.map