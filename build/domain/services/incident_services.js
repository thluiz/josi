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
var sql = require('mssql');
var IncidentService = /** @class */ (function () {
    function IncidentService(sql_pool) {
        this.sql_pool = sql_pool;
    }
    IncidentService.prototype.start_incident = function (incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('incident', sql.Int, incident.id)
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("StartIncident")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    IncidentService.prototype.reopen_incident = function (incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('id', sql.Int, incident.id)
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("ReopenIncident")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    IncidentService.prototype.cancel_start_incident = function (incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('incident', sql.Int, incident.id)
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("CancelIncidentStart")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    IncidentService.prototype.close_incident = function (incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('id', sql.Int, incident.id)
                            .input('close_description', sql.VarChar(sql.MAX), incident.closing_contact_text || "")
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("CloseIncident")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    IncidentService.prototype.remove_incident = function (incident) {
        return __awaiter(this, void 0, void 0, function () {
            var result, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new sql.Request(this.sql_pool)
                                .input('id', sql.Int, incident.id)
                                .execute("RemoveIncident")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        ex_1 = _a.sent();
                        console.log(ex_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    IncidentService.prototype.register_incident = function (incident) {
        return __awaiter(this, void 0, void 0, function () {
            var date, result, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = incident.date.year + "-" + incident.date.month + "-" + incident.date.day;
                        if (incident.time) {
                            date += " " + incident.time.hour + ":" + incident.time.minute;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new sql.Request(this.sql_pool)
                                .input('description', sql.VarChar(sql.MAX), incident.description)
                                .input('people', sql.VarChar(sql.MAX), incident.people.filter(function (f) { return f.person_id > 0; }).map(function (p) { return p.person_id; }).join(","))
                                .input('date', sql.VarChar(100), date)
                                .input('type', sql.Int, incident.type.id)
                                .input('branch', sql.Int, incident.branch_id)
                                .input('value', sql.Decimal(12, 2), incident.value)
                                .input('start_activity', sql.Int, incident.start_activity ? 1 : 0)
                                .input('new_people', sql.VarChar(sql.MAX), incident.people.filter(function (f) { return f.person_id == 0; }).map(function (p) { return p.name.trim(); }).join(","))
                                .execute("RegisterNewIncident")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        ex_2 = _a.sent();
                        console.log(ex_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IncidentService.prototype.reschedule_incident = function (incident, new_incident, contact) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('id', sql.Int, incident.id)
                            .input('new_date', sql.VarChar(16), new_incident.date + ' ' + new_incident.start_hour)
                            .input('contact', sql.VarChar(sql.MAX), contact)
                            .execute("RescheduleIncident")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IncidentService.prototype.register_contact_for_incident = function (incident, text) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('id', sql.Int, incident.id)
                            .input('contact', sql.VarChar(sql.MAX), text)
                            .execute("RegisterContactForIncident")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    IncidentService.prototype.save_comment = function (incident_id, comment) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('incident_id', sql.Int, incident_id)
                            .input('comment', sql.NVarChar(sql.MAX), comment)
                            .execute("SaveIncidentComment")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    IncidentService.prototype.archive_comment = function (comment_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('comment_id', sql.Int, comment_id)
                            .execute("TogleIncidentCommentArchived")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return IncidentService;
}());
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident_services.js.map