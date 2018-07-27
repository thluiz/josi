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
const database_facility_1 = require("./../facilities/database-facility");
const logger_service_1 = require("./logger-service");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const firebase_emitter_decorator_1 = require("../decorators/firebase-emitter-decorator");
const Incident_1 = require("../entity/Incident");
const ownership_closing_report_1 = require("./reports/ownership-closing-report");
exports.EVENTS_COLLECTION = "incident-events";
exports.INCIDENT_ADDED = "INCIDENT_ADDED";
exports.INCIDENT_STARTED = "INCIDENT_STARTED";
exports.INCIDENT_CHANGED = "INCIDENT_CHANGED";
exports.INCIDENT_TREATED = "INCIDENT_TREATED";
exports.INCIDENT_ENDED = "INCIDENT_ENDED";
exports.INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
exports.INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";
class IncidentsService {
    static start_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield database_facility_1.DatabaseFacility
                .ExecuteTypedJsonSP(exports.INCIDENT_STARTED, "StartIncident", { "incident": incident.id }, { "responsible_id": responsible_id });
            return execution;
        });
    }
    static reopen_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield database_facility_1.DatabaseFacility.ExecuteTypedJsonSP(exports.INCIDENT_STARTED, "ReopenIncident", { "incident": incident.id }, { "responsible_id": responsible_id });
            return execution;
        });
    }
    static cancel_start_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield database_facility_1.DatabaseFacility
                .ExecuteTypedJsonSP(exports.INCIDENT_CHANGED, "CancelIncidentStart", { "incident": incident.id }, { "responsible_id": responsible_id });
            return execution;
        });
    }
    static close_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(incident);
            let execution = yield database_facility_1.DatabaseFacility.ExecuteTypedJsonSP(exports.INCIDENT_ENDED, "CloseIncident", { "incident": incident.id }, { "close_description": incident.close_text || "" }, { "title": incident.title || "" }, { "responsible_id": responsible_id }, { "fund_value": incident.fund_value }, { "payment_method_id": incident.payment_method_id > 0 ?
                    incident.payment_method_id : null });
            if (execution.success) {
                try {
                    const IR = yield database_facility_1.DatabaseFacility.getRepository(Incident_1.Incident);
                    const light_incident = yield IR.findOne(incident.id);
                    yield ownership_closing_report_1.OwnershipClosingReport.send(light_incident.id);
                }
                catch (ex) {
                    logger_service_1.LoggerService.error(logger_service_1.ErrorOrigins.SendingEmail, ex);
                }
            }
            return execution;
        });
    }
    static remove_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield database_facility_1.DatabaseFacility.ExecuteTypedJsonSP(exports.INCIDENT_CANCELLED, "RemoveIncident", { "incident": incident.id }, { "responsible_id": responsible_id });
            return execution;
        });
    }
    static register_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
            if (incident.time) {
                date += ` ${incident.time.hour}:${incident.time.minute}`;
            }
            let execution = yield database_facility_1.DatabaseFacility
                .ExecuteTypedJsonSP(exports.INCIDENT_ADDED, "RegisterNewIncident", { "description": incident.description }, { "responsible_id": responsible_id }, { "people": incident.people.filter(f => f.person_id > 0)
                    .map(p => p.person_id).join(",") }, { "date": date }, { "type": incident.type.id }, { "branch": incident.branch_id }, { "title": incident.title }, { "value": incident.value }, { "start_activity": incident.start_activity ? 1 : 0 }, { "register_closed": incident.close_activity == 1 ? 1 : 0 }, { "register_treated": incident.close_activity == 2 ? 1 : 0 }, { "new_people": incident.people.filter(f => f.person_id == 0)
                    .map(p => p.name.trim()).join(",") }, { "add_to_ownernership": incident.add_to_ownernership }, { "new_owner_id": incident.new_owner_id }, { "new_support_id": incident.new_support_id }, { "ownership_id": incident.ownership ? incident.ownership.id : null });
            return execution;
        });
    }
    static reschedule_incident(incident, new_incident, contact, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield database_facility_1.DatabaseFacility.ExecuteTypedJsonSP(exports.INCIDENT_RESCHEDULED, "RescheduleIncident", { "incident": incident.id }, { "contact": contact }, { "new_date": new_incident.date + ' ' + new_incident.start_hour }, { "responsible_id": responsible_id });
            return execution;
        });
    }
    static register_contact_for_incident(incident, contact, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield database_facility_1.DatabaseFacility.ExecuteTypedJsonSP(exports.INCIDENT_TREATED, "RegisterContactForIncident", { "incident": incident.id }, { "contact": contact }, { "responsible_id": responsible_id });
            return execution;
        });
    }
}
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "start_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "reopen_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "cancel_start_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "close_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "remove_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "register_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "reschedule_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService, "register_contact_for_incident", null);
exports.IncidentsService = IncidentsService;
//# sourceMappingURL=incidents-service.js.map