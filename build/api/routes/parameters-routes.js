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
var jobs_services_1 = require("../../domain/services/jobs_services");
function configure_routes(app, connection_pool) {
    var _this = this;
    var pool = connection_pool;
    var jobs = new jobs_services_1.JobsService(connection_pool);
    app.get("/api/branches/:id?", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!req.params.id) return [3 /*break*/, 2];
                    return [4 /*yield*/, new sql.Request(pool)
                            .execute("GetBranches")];
                case 1:
                    result = _a.sent();
                    res.send(result.recordset[0]);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new sql.Request(pool)
                        .input("branch", sql.Int, req.params.id)
                        .query("select * from vwBranch where id = @branch for json path")];
                case 3:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/branch_maps/branch/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("branch_id", sql.Int, req.params.id)
                        .execute("GetBranchMap")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/branch_products/branch/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("branch_id", sql.Int, req.params.id)
                        .execute("GetBranchProducts")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/domains", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetDomains")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/programs", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetPrograms")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/configurations", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .query("select * from [configuration] for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500).json(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/products", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .query("select * from [vwProduct] where archived = 0 for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    if (error_2.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        res.status(500).json(error_2);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/product_categories", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .query("select * from [product_category] for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    if (error_3.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        res.status(500).json(error_3);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/countries", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from [country] order by [order] for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/kf_families", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetKungFuFamilies")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/recurrence_types", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetRecurrenceTypes")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/incident_types", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetIncidentTypes")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/contact_types", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetContactTypes")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/roles", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetRoles")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/groups", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from [group] where active = 1 order by [order] for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/locations", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from [location] where active = 1 order by [order] for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/payment_methods", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from payment_method where active = 1 order by [order] for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/acquirers", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from acquirer where active = 1 order by [order] for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/currencies", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from currency for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * UPDATES
     */
    app.post("/api/branches", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var branch, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    branch = req.body.branch;
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, branch.id)
                            .input('name', sql.VarChar(100), branch.name)
                            .input('abrev', sql.VarChar(100), branch.abrev)
                            .input('initials', sql.VarChar(3), branch.initials)
                            .query("update branch set\n                    name = @name,\n                    abrev = @abrev,\n                    initials = @initials\n                where id = @id")];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/payment_methods", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var payment_method, result, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payment_method = req.body.payment_method;
                    if (!(payment_method.id > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, payment_method.id)
                            .input('name', sql.VarChar(100), payment_method.name)
                            .input('order', sql.Int, payment_method.order)
                            .query("update payment_method set\n                        name = @name,\n                        [order] = @order\n                    where id = @id")];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new sql.Request(pool)
                        .input('name', sql.VarChar(100), payment_method.name)
                        .input('order', sql.Int, payment_method.order)
                        .query("insert into payment_method (name, [order])\n                    values (@name, @order)")];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/acquirers", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var acquirer, result, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acquirer = req.body.acquirer;
                    if (!(acquirer.id > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, acquirer.id)
                            .input('name', sql.VarChar(100), acquirer.name)
                            .input('order', sql.Int, acquirer.order)
                            .query("update acquirer set\n                        name = @name,\n                        [order] = @order\n                    where id = @id")];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new sql.Request(pool)
                        .input('name', sql.VarChar(100), acquirer.name)
                        .input('order', sql.Int, acquirer.order)
                        .query("insert into acquirer (name, [order])\n                    values (@name, @order)")];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/product_categories", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var product_category, result, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    product_category = req.body.product_category;
                    if (!(product_category.id > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, product_category.id)
                            .input('name', sql.VarChar(100), product_category.name)
                            .query("update product_category set\n                        name = @name\n                    where id = @id")];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new sql.Request(pool)
                        .input('name', sql.VarChar(100), product_category.name)
                        .query("insert into product_category (name)\n                    values (@name)")];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/currencies", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var currency, result, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currency = req.body.currency;
                    if (!(currency.id > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, currency.id)
                            .input('name', sql.VarChar(100), currency.name)
                            .input('symbol', sql.VarChar(3), currency.symbol)
                            .query("update currency set\n                        name = @name,\n                        [symbol] = @symbol\n                    where id = @id")];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new sql.Request(pool)
                        .input('name', sql.VarChar(100), currency.name)
                        .input('symbol', sql.VarChar(3), currency.symbol)
                        .query("insert into currency (name, [symbol])\n                    values (@name, @symbol)")];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/branch_maps/archive", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('id', sql.Int, req.body.id)
                        .query("update branch_map set\n                    active = 0                    \n                where id = @id")];
                case 1:
                    result = _a.sent();
                    jobs.update_voucher_site();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/branch_products/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("id", sql.Int, req.body.id)
                        .input("branch_id", sql.Int, req.params.id)
                        .input("currency_id", sql.Int, req.body.currency_id)
                        .input("category_id", sql.Int, req.body.category_id)
                        .input("name", sql.VarChar(250), req.body.name)
                        .input("base_value", sql.Decimal(12, 2), req.body.base_value)
                        .execute("SaveBranchProduct")];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/branch_products/archive/:branch_id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('id', sql.Int, req.body.product.id)
                        .query("update branch_product set\n                    archived = 1\n                where id = @id")];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/branch_products", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("branch_id", sql.Int, req.body.branch_id)
                        .input("product_id", sql.Int, req.body.product_id)
                        .input("base_value", sql.Decimal(12, 2), req.body.base_value)
                        .execute("AssociateBranchProduct")];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/branch_maps", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var week_days, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    week_days = req.body.week_days
                        .filter(function (wk) { return wk.selected; })
                        .map(function (wk) {
                        return wk.week_day;
                    })
                        .join(",");
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("id", sql.Int, req.body.id || 0)
                            .input("branch_id", sql.Int, req.body.branch_id)
                            .input("incident_type_id", sql.Int, req.body.incident_type_id)
                            .input("receive_voucher", sql.Bit, req.body.receive_voucher)
                            .input("week_days", sql.VarChar(sql.MAX), week_days)
                            .input("start_hour", sql.Int, req.body.start_time ? req.body.start_time.hour : 0)
                            .input("start_minute", sql.Int, req.body.start_time ? req.body.start_time.minute : 0)
                            .input("end_hour", sql.Int, req.body.end_time ? req.body.end_time.hour : 0)
                            .input("end_minute", sql.Int, req.body.end_time ? req.body.end_time.minute : 0)
                            .input("title", sql.VarChar(200), req.body.title)
                            .execute("SaveBranchMap")];
                case 1:
                    result = _a.sent();
                    jobs.update_voucher_site();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/products/archive", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var product, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    product = req.body.product;
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, product.id)
                            .query("update product set\n            archived = 1\n        where id = @id")];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/products", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var product, result, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    product = req.body.product;
                    if (!(product.id > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, product.id)
                            .input('name', sql.VarChar(100), product.name)
                            .input('base_value', sql.Decimal(12, 2), product.base_value)
                            .input('association_percentage', sql.Decimal(12, 2), product.association_percentage)
                            .input('im_percentage', sql.Decimal(12, 2), product.im_percentage)
                            .input('local_percentage', sql.Decimal(12, 2), product.local_percentage)
                            .input('association_minimal_value', sql.Decimal(12, 2), product.association_minimal_value)
                            .input('im_minimal_value', sql.Decimal(12, 2), product.im_minimal_value)
                            .input('local_minimal_value', sql.Decimal(12, 2), product.local_minimal_value)
                            .input('currency_id', sql.Int, product.currency_id || 1)
                            .input('category_id', sql.Int, product.category_id)
                            .query("update product set\n                        name = @name,\n                        [association_percentage] = @association_percentage,\n                        [im_percentage] = @im_percentage,\n                        [local_percentage] = @local_percentage,                        \n                        [association_minimal_value] = @association_minimal_value,\n                        [im_minimal_value] = @im_minimal_value,\n                        [local_minimal_value] = @local_minimal_value,\n                        base_value = @base_value,\n                        currency_id = @currency_id,\n                        category_id = @category_id\n                    where id = @id")];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, new sql.Request(pool)
                        .input('name', sql.VarChar(100), product.name)
                        .input('base_value', sql.Decimal(12, 2), product.base_value)
                        .input('association_percentage', sql.Decimal(12, 2), product.association_percentage)
                        .input('im_percentage', sql.Decimal(12, 2), product.im_percentage)
                        .input('local_percentage', sql.Decimal(12, 2), product.local_percentage)
                        .input('association_minimal_value', sql.Decimal(12, 2), product.association_minimal_value)
                        .input('im_minimal_value', sql.Decimal(12, 2), product.im_minimal_value)
                        .input('local_minimal_value', sql.Decimal(12, 2), product.local_minimal_value)
                        .input('currency_id', sql.Int, product.currency_id || 1)
                        .input('category_id', sql.Int, product.category_id)
                        .query("insert into product (name, base_value, country_id, [association_percentage], im_percentage, local_percentage, \n                    association_minimal_value, im_minimal_value, local_minimal_value, currency_id, category_id)\n                values (@name, @base_value, 1, @association_percentage, @im_percentage, @local_percentage,\n                @association_minimal_value, @im_minimal_value, @local_minimal_value, @currency_id, @category_id)")];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/branches_acquirers", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('branch_id', sql.Int, req.body.branch_id)
                        .input('acquirer_id', sql.Int, req.body.acquirer_id)
                        .execute("ToggleBranchAcquirerAssociation")];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=parameters-routes.js.map