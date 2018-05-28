"use strict";
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
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
const firebase_service_1 = require("./firebase-service");
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
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonStringSP("StartIncident", { "incident": incident.id }, { "responsible_id": responsible_id });
                if (!execution.success) {
                    return execution;
                }
                firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                    event_type: exports.INCIDENT_STARTED,
                    data: execution.data
                });
                return result_1.Result.Ok(JSON.parse(execution.data));
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static reopen_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonStringSP("ReopenIncident", { "incident": incident.id }, { "responsible_id": responsible_id });
                if (!execution.success) {
                    return execution;
                }
                firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                    event_type: exports.INCIDENT_STARTED,
                    data: execution.data
                });
                return result_1.Result.Ok(JSON.parse(execution.data));
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static cancel_start_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonStringSP("CancelIncidentStart", { "incident": incident.id }, { "responsible_id": responsible_id });
                if (!execution.success) {
                    return execution;
                }
                firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                    event_type: exports.INCIDENT_CHANGED,
                    data: execution.data
                });
                return result_1.Result.Ok(JSON.parse(execution.data));
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static close_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonStringSP("CloseIncident", { "incident": incident.id }, { "close_description": incident.closing_contact_text || "" }, { "responsible_id": responsible_id });
                if (!execution.success) {
                    return execution;
                }
                firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                    event_type: exports.INCIDENT_ENDED,
                    data: execution.data
                });
                return result_1.Result.Ok(JSON.parse(execution.data));
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static remove_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonStringSP("RemoveIncident", { "incident": incident.id }, { "responsible_id": responsible_id });
                console.log(execution);
                if (!execution.success) {
                    return execution;
                }
                firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                    event_type: exports.INCIDENT_CANCELLED,
                    data: execution.data
                });
                return result_1.Result.Ok(JSON.parse(execution.data));
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static register_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
            if (incident.time) {
                date += ` ${incident.time.hour}:${incident.time.minute}`;
            }
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonSP("RegisterNewIncident", { "description": incident.description }, { "responsible_id": responsible_id }, { "people": incident.people.filter(f => f.person_id > 0).map(p => p.person_id).join(",") }, { "date": date }, { "type": incident.type.id }, { "branch": incident.branch_id }, { "value": incident.value }, { "start_activity": incident.start_activity ? 1 : 0 }, { "register_closed": incident.close_activity == 1 ? 1 : 0 }, { "register_treated": incident.close_activity == 2 ? 1 : 0 }, { "new_people": incident.people.filter(f => f.person_id == 0).map(p => p.name.trim()).join(",") });
                if (!execution.success) {
                    return execution;
                }
                execution.data.forEach(element => {
                    firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                        event_type: exports.INCIDENT_ADDED,
                        data: JSON.stringify(execution.data)
                    });
                });
                return result_1.Result.Ok(execution.data);
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static reschedule_incident(incident, new_incident, contact, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonStringSP("RescheduleIncident", { "incident": incident.id }, { "contact": contact }, { "new_date": new_incident.date + ' ' + new_incident.start_hour }, { "responsible_id": responsible_id });
                if (!execution.success) {
                    return execution;
                }
                firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                    event_type: exports.INCIDENT_RESCHEDULED,
                    data: execution.data
                });
                return result_1.Result.Ok(JSON.parse(execution.data));
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static register_contact_for_incident(incident, contact, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let execution = yield database_facility_1.DatabaseFacility.ExecuteJsonStringSP("RegisterContactForIncident", { "incident": incident.id }, { "contact": contact }, { "responsible_id": responsible_id });
                if (!execution.success) {
                    return execution;
                }
                firebase_service_1.FirebaseService.emit_event(exports.EVENTS_COLLECTION, {
                    event_type: exports.INCIDENT_TREATED,
                    data: execution.data
                });
                return result_1.Result.Ok(JSON.parse(execution.data));
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
}
exports.IncidentsService = IncidentsService;
//# sourceMappingURL=incidents-service.js.map