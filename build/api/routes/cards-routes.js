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
var card_services_1 = require("../../domain/services/card_services");
function configure_routes(app, connection_pool) {
    var _this = this;
    var pool = connection_pool;
    var card_service = new card_services_1.CardService(pool);
    app.get("/api/cards/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("card", sql.Int, req.params.id)
                        .query("select * from vwCard where id = @card for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_card_positions", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from person_card_position where active = 1 for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/operators", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * \n                from vwPerson v \n                where is_operator = 1 or is_director = 1 or is_manager = 1 \n                order by name for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/card_templates", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * \n                from card_template \n                where active = 1\n                order by [order] \n                for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/organizations/flat", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetFlatOrganizationsData")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/organizations/:id?/:include_childrens?", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("organization_id", sql.Int, req.params.id > 0 ? req.params.id : null)
                        .input("include_childrens", sql.Int, req.params.include_childrens > 0 ? 1 : 0)
                        .execute("GetOrganizations")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] :
                        req.params.id > 0 ? response[0] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/projects/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("project_id", sql.Int, req.params.id)
                            .execute("GetProject")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] :
                        req.params.id > 0 ? response[0] : response);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    res.status(500).json(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_cards", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, card_service.save_person_card(req.body.person_card)];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/cards", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, card_service.save_card(req.body.card, user.person_id)];
                case 2:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] :
                        req.params.id > 0 ? response[0] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/move_card", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("card_id", sql.Int, req.body.card_id)
                            .input("parent_id", sql.Int, req.body.parent_id)
                            .input("step_id", sql.Int, req.body.step_id)
                            .input("responsible_id", sql.Int, user.person_id)
                            .execute("MoveCard")];
                case 2:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/cards_comments", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, card_service.save_card_comment(req.body.card, req.body.comment, req.body.commentary_type, user.person_id)];
                case 2:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/cards_comments/:card_id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input("card_id", sql.Int, req.params.card_id)
                        .execute("GetCardCommentaries")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/cards/steps", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, card_service.save_card_step(req.body.card_id, req.body.step_id, user.person_id)];
                case 2:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/cards/steps/card_order", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, card_service.save_card_order(req.body.card_id, req.body.order)];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_cards/delete", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, card_service.remove_person_card(req.body.person_card)];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/archive_card", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, card_service.toggle_card_archived(req.body.card, user.person_id)];
                case 2:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response[0]);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=cards-routes.js.map