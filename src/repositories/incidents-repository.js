"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_facility_1 = require("../facilities/database-facility");
const result_1 = require("../helpers/result");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const showdown = require("showdown");
const converter = new showdown.Converter();
class IncidentsRepository {
    static getCurrentActivities(branch_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetCurrentActivities", { "branch_id": branch_id });
            return result;
        });
    }
    static getPeopleSummary(branch_id, week_modifier, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetPeopleSummary", { "branch": branch_id }, { "week_modifier": week_modifier }, { "date": date });
        });
    }
    static getSummary(branch_id, month_modifier, week_modifier, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetPeopleSummary", { "branch": branch_id }, { "month_modifier": month_modifier }, { "week_modifier": week_modifier }, { "date": date });
        });
    }
    static getDailyMonitor(branch_id, display, display_modifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetDailyMonitor2", { "branch": branch_id }, { "display_modifier": display_modifier }, { "display": display });
        });
    }
    static getPersonIncidentsHistory(person_id, start_date, end_date, activity_type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetPersonIncidentHistory2", { "person_id": person_id }, { "start_date": start_date }, { "end_date": end_date }, { "activity_type": activity_type });
        });
    }
    static getIncidentDetails(incident_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetIncidentDetails", { "id": incident_id });
        });
    }
    static getAgenda(branch_id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetAgenda2", { "branch_id": branch_id }, { "date": date });
        });
    }
    static getOwnershipData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownership_data = yield database_facility_1.DatabaseFacility.ExecuteJsonSP("getOwnershipData", {
                "ownership_id": id
            });
            const data = ownership_data.data[0];
            for (var i = 0; i < data.incidents.length; i++) {
                if (data.incidents[i].description) {
                    const d = data.incidents[i].description.replace(/\r?\n/g, "<br />");
                    console.log(d);
                    data.incidents[i].description = converter.makeHtml(d);
                }
                if (data.incidents[i].close_text) {
                    const d = data.incidents[i].close_text.replace(/\r?\n/g, "<br />");
                    data.incidents[i].close_text = converter.makeHtml(d);
                }
            }
            return result_1.Result.GeneralOk(data);
        });
    }
}
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getCurrentActivities", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getPeopleSummary", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getSummary", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getDailyMonitor", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getPersonIncidentsHistory", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getIncidentDetails", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getAgenda", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncidentsRepository, "getOwnershipData", null);
exports.IncidentsRepository = IncidentsRepository;
//# sourceMappingURL=incidents-repository.js.map