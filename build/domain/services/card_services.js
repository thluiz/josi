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
var CardService = /** @class */ (function () {
    function CardService(sql_pool) {
        this.sql_pool = sql_pool;
    }
    CardService.prototype.save_card = function (card, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            var date;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = card.due_date ? card.due_date.year + "-" + card.due_date.month + "-" + card.due_date.day : null;
                        if (date != null && card.due_time) {
                            date += " " + card.due_time.hour + ":" + card.due_time.minute;
                        }
                        if (!(card.id && card.id > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, new sql.Request(this.sql_pool)
                                .input('card_id', sql.Int, card.id)
                                .input('title', sql.NVarChar(500), card.title)
                                .input('due_date', sql.VarChar(10), date)
                                .input('description', sql.NVarChar(sql.MAX), card.description)
                                .input('location_id', sql.Int, card.locations != null && card.locations[0] ? card.locations[0].id : 1)
                                .input('leader_id', sql.Int, card.leaders != null && card.leaders[0] ? card.leaders[0].id : (card.leaders.person_id || card.leaders.id))
                                .input('abrev', sql.VarChar(15), card.abrev)
                                .input('responsible_id', sql.Int, responsible_id)
                                .execute("UpdateCard")];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('title', sql.NVarChar(500), card.title)
                            .input('parent_id', sql.Int, card.parent.id)
                            .input('due_date', sql.VarChar(10), date)
                            .input('description', sql.NVarChar(sql.MAX), card.description)
                            .input('location_id', sql.Int, card.locations != null && card.locations[0] ? card.locations[0].id : 1)
                            .input('card_template_id', sql.Int, card.template ? card.template.id : 3)
                            .input('leader_id', sql.Int, card.leaders.person_id || card.leaders.id)
                            .input('people', sql.VarChar(sql.MAX), card.people ? card.people.filter(function (f) { return f.person_id > 0; }).map(function (p) { return p.person_id; }).join(",") : null)
                            .input('new_people', sql.VarChar(sql.MAX), card.people ? card.people.filter(function (f) { return f.person_id == 0; }).map(function (p) { return p.name.trim(); }).join(",") : null)
                            .input('abrev', sql.VarChar(15), card.abrev)
                            .input('group_id', sql.Int, card.group ? card.group.id : null)
                            .input('branch_id', sql.Int, card.branch ? card.branch.id : null)
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("SaveCard")];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CardService.prototype.save_person_card = function (person_card) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('card_id', sql.Int, person_card.card_id)
                            .input('person_id', sql.Int, person_card.person_id)
                            .input('position_id', sql.Int, person_card.position_id || 4)
                            .input('position_description', sql.VarChar(100), person_card.position_description || null)
                            .input('order', sql.Int, person_card.order || -1)
                            .execute("SavePersonCard")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CardService.prototype.remove_person_card = function (person_card) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('card_id', sql.Int, person_card.card_id)
                            .input('person_id', sql.Int, person_card.person_id)
                            .execute("RemovePersonCard")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CardService.prototype.toggle_card_archived = function (card, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('card_id', sql.Int, card.id)
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("ToggleCardArchived")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CardService.prototype.save_card_step = function (card_id, step_id, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('card_id', sql.Int, card_id)
                            .input('step_id', sql.Int, step_id)
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("SaveCardStep")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CardService.prototype.save_card_order = function (card_id, order) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('card_id', sql.Int, card_id)
                            .input('order', sql.Int, order)
                            .execute("SaveCardOrder")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CardService.prototype.save_card_comment = function (card, commentary, commentary_type, responsible_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('card_id', sql.Int, card.id)
                            .input('commentary', sql.NVarChar(sql.MAX), commentary)
                            .input('commentary_type', sql.Int, commentary_type || 1)
                            .input('responsible_id', sql.Int, responsible_id)
                            .execute("SaveCardCommentary")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * JOBS
     */
    CardService.prototype.check_cards_has_overdue_cards = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("CheckCardsHasOverdueCards")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    CardService.prototype.correct_card_out_of_parent_step = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("CorrectCardOutOfParentStep")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return CardService;
}());
exports.CardService = CardService;
//# sourceMappingURL=card_services.js.map