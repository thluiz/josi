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
var incident_services_1 = require("../../domain/services/incident_services");
var security_services_1 = require("../../domain/services/security_services");
function configure_routes(app, connection_pool) {
    var _this = this;
    var pool = connection_pool;
    var incident_service = new incident_services_1.IncidentService(pool);
    app.post("/api/incident/close", security_services_1.SecurityService.ensureLoggedIn(), function (req, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, incident_service.close_incident(req.body.incident, user.person_id)];
                case 2:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident/start", security_services_1.SecurityService.ensureLoggedIn(), function (req, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, incident_service.start_incident(req.body.incident, user.person_id)];
                case 2:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident/reopen", security_services_1.SecurityService.ensureLoggedIn(), function (req, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, incident_service.reopen_incident(req.body.incident, user.person_id)];
                case 2:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident/start/cancel", security_services_1.SecurityService.ensureLoggedIn(), function (req, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var user, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security_services_1.SecurityService.getUserFromRequest(req)];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, incident_service.cancel_start_incident(req.body.incident, user.person_id)];
                case 2:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident/remove", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, incident_service.remove_incident(request.body.incident)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident/reschedule", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, incident_service.reschedule_incident(request.body.incident, request.body.new_incident, request.body.contact.contact_text)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident/register_incident", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, incident_service.register_incident(request.body.incident)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident/register_contact", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, incident_service.register_contact_for_incident(request.body.incident, request.body.contact.contact_text)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * COMMENTS
     */
    app.get("/api/incident_comments/incident/:id/:show_archived?", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('incident_id', sql.Int, request.params.id)
                            .input('show_archived', sql.Int, request.params.show_archived || 0)
                            .execute("GetIncidentComments")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
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
    app.post("/api/incident_comments", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, incident_service.save_comment(request.body.incident_id, request.body.comment)];
                case 1:
                    result = _a.sent();
                    res.send(result.recordset[0][0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/incident_comments/archive", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, incident_service.archive_comment(request.body.id)];
                case 1:
                    result = _a.sent();
                    res.send(result.recordset[0][0]);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=incidents-routes.js.map