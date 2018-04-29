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
var sumary_services_1 = require("./sumary_services");
var person_services_1 = require("./person_services");
var card_services_1 = require("./card_services");
var axios_1 = require("axios");
var sql = require('mssql');
var JobsService = /** @class */ (function () {
    function JobsService(sql_pool) {
        this.sql_pool = sql_pool;
        this.sumary_service = new sumary_services_1.SumaryService(sql_pool);
        this.person_service = new person_services_1.PersonService(sql_pool);
        this.card_service = new card_services_1.CardService(sql_pool);
    }
    JobsService.prototype.update_voucher_site = function () {
        try {
            var start = Date.now();
            axios_1.default.get(process.env.VOUCHER_SITE_UPDATE_URL)
                .then(function (response) {
                console.log('voucher site updated!');
            });
        }
        catch (ex) {
            console.log(ex);
        }
    };
    JobsService.prototype.hourly_jobs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, this.card_service.correct_card_out_of_parent_step()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.person_service.generate_birthdate_incidents()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.person_service.cancel_expired_people_scheduling()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.person_service.check_people_status()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.person_service.check_people_comunication_status()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.person_service.check_people_financial_status()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.person_service.check_people_scheduling_status()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.card_service.check_cards_has_overdue_cards()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.sumary_service.consolidate_members_sumary()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.sumary_service.consolidate_activity_sumary()];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        ex_1 = _a.sent();
                        console.log(ex_1);
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    return JobsService;
}());
exports.JobsService = JobsService;
//# sourceMappingURL=jobs_services.js.map