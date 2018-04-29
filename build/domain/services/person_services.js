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
var PersonService = /** @class */ (function () {
    function PersonService(sql_pool) {
        this.sql_pool = sql_pool;
    }
    PersonService.prototype.save_address = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_id', sql.Int, address.person_id)
                            .input('country_id', sql.Int, address.country_id)
                            .input('postal_code', sql.VarChar(30), address.postal_code)
                            .input('street', sql.VarChar(200), address.street)
                            .input('district', sql.VarChar(100), address.district)
                            .input('city', sql.VarChar(100), address.city)
                            .input('state', sql.VarChar(100), address.state)
                            .input('number', sql.VarChar(30), address.number)
                            .input('complement', sql.VarChar(50), address.complement)
                            .execute("SaveAddress")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.archive_address = function (person_address) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('address_id', sql.Int, person_address.address_id)
                            .execute("ArchiveAddress")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.add_role = function (person_id, role_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_id', sql.Int, person_id)
                            .input('role_id', sql.Int, role_id)
                            .execute("AddPersonRole")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.remove_role = function (person_id, role_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_id', sql.Int, person_id)
                            .input('role_id', sql.Int, role_id)
                            .execute("RemovePersonRole")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.change_kf_name = function (person_id, kf_name, ideograms) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_id', sql.Int, person_id)
                            .input('alias', sql.VarChar(150), kf_name)
                            .input('kf_name', sql.Bit, 1)
                            .input('ideograms', sql.NVarChar(100), ideograms)
                            .execute("AddAlias")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.update_person_data = function (person) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('id', sql.Int, person.id)
                            .input('name', sql.VarChar(200), person.name)
                            .input('birth_date', sql.VarChar(10), person.birth_date)
                            .input('admission_date', sql.VarChar(10), person.admission_date)
                            .input('enrollment_date', sql.VarChar(10), person.enrollment_date)
                            .input('baaisi_date', sql.VarChar(10), person.baaisi_date)
                            .input('passport_expiration_date', sql.VarChar(10), person.passport_expiration_date)
                            .input('kf_name', sql.VarChar(200), person.kf_name)
                            .input('identification', sql.VarChar(50), person.identification)
                            .input('identification2', sql.VarChar(50), person.identification2)
                            .input('passport', sql.VarChar(50), person.passport)
                            .input('occupation', sql.VarChar(100), person.occupation)
                            .input('kf_name_ideograms', sql.NVarChar(200), person.kf_name_ideograms)
                            .input('family_id', sql.Int, person.family_id > 0 ? person.family_id : null)
                            .input('destiny_family_id', sql.Int, person.destiny_family_id > 0 ? person.destiny_family_id : null)
                            .input('branch_id', sql.Int, person.branch_id > 0 ? person.branch_id : null)
                            .input('domain_id', sql.Int, person.domain_id > 0 ? person.domain_id : null)
                            .input('program_id', sql.Int, person.program_id > 0 ? person.program_id : null)
                            .execute("UpdatePersonData")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PersonService.prototype.register_new_person = function (person, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('role_id', sql.Int, person.role_id > 0 ? person.role_id : null)
                            .input('name', sql.VarChar(200), person.name)
                            .input('branch_id', sql.Int, person.branch_id > 0 ? person.branch_id : null)
                            .input('birth_date', sql.VarChar(10), person.birth_date)
                            .input('identification', sql.VarChar(50), person.identification)
                            .input('identification2', sql.VarChar(50), person.identification2)
                            .input('occupation', sql.VarChar(100), person.occupation)
                            .input('next_incident_type', sql.Int, person.next_incident_type > 0 ? person.next_incident_type : null)
                            .input('next_incident_date', sql.VarChar(10), person.next_incident_date && person.next_incident_date.length > 10 ? person.next_incident_date : null)
                            .input('next_incident_description', sql.NVarChar(sql.MAX), person.next_incident_description)
                            .input('initial_contact', sql.NVarChar(sql.MAX), person.initial_contact)
                            .input('comment', sql.NVarChar(sql.MAX), person.comment)
                            .input('user_id', sql.Int, user.id)
                            .execute("RegisterNewPerson")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PersonService.prototype.remove_schedule = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_schedule_id', sql.Int, id)
                            .execute("CancelPersonSchedule")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PersonService.prototype.save_schedule = function (schedule) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_id', sql.Int, schedule.person_id)
                            .input('branch_id', sql.Int, schedule.branch_id)
                            .input('incident_type', sql.Int, schedule.incident_type)
                            .input('recurrence_type', sql.Int, schedule.recurrence_type)
                            .input('start_date', sql.VarChar(10), schedule.start_date)
                            .input('start_hour', sql.Int, schedule.start_hour)
                            .input('start_minute', sql.Int, schedule.start_minute)
                            .input('end_date', sql.VarChar(10), schedule.end_date)
                            .input('end_hour', sql.Int, schedule.end_hour)
                            .input('end_minute', sql.Int, schedule.end_minute)
                            .input('number_of_incidents', sql.Int, schedule.number_of_incidents)
                            .input('description', sql.NVarChar(sql.MAX), schedule.description)
                            .input('value', sql.Decimal(12, 2), schedule.value)
                            .execute("SavePersonScheduleAndGenerateIncidents")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PersonService.prototype.remove_contact = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('contact_id', sql.Int, id)
                            .execute("RemovePersonContact")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PersonService.prototype.save_contact = function (contact_data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_id', sql.Int, contact_data.person_id)
                            .input('contact_type', sql.Int, contact_data.contact_type)
                            .input('contact', sql.VarChar(250), contact_data.contact)
                            .input('details', sql.VarChar(sql.MAX), contact_data.details)
                            .input('principal', sql.Int, contact_data.principal)
                            .execute("SavePersonContact")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PersonService.prototype.check_people_comunication_status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("CheckPeopleComunicationStatus")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.check_people_status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("CheckPeopleStatus")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.check_people_financial_status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("CheckPeopleFinancialStatus")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.check_people_scheduling_status = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("CheckPeopleSchedulingStatus")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.generate_birthdate_incidents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("GenerateBirthDateIncidents")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.cancel_expired_people_scheduling = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .execute("CancelExpiredPeopleScheduling")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.save_comment_about = function (person_id, comment) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('person_id', sql.Int, person_id)
                            .input('comment', sql.NVarChar(sql.MAX), comment)
                            .execute("SavePersonComment")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PersonService.prototype.archive_comment = function (comment_id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new sql.Request(this.sql_pool)
                            .input('comment_id', sql.Int, comment_id)
                            .execute("ToglePersonCommentArchived")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return PersonService;
}());
exports.PersonService = PersonService;
//# sourceMappingURL=person_services.js.map