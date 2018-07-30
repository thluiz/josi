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
const PersonIncident_1 = require("./../entity/PersonIncident");
const IncidentType_1 = require("./../entity/IncidentType");
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
const logger_service_1 = require("./logger-service");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const firebase_emitter_decorator_1 = require("../decorators/firebase-emitter-decorator");
const Incident_1 = require("../entity/Incident");
const ownership_closing_report_1 = require("./reports/ownership-closing-report");
const base_service_1 = require("./base-service");
const configurations_services_1 = require("./configurations-services");
exports.EVENTS_COLLECTION = "incident-events";
exports.INCIDENT_ADDED = "INCIDENT_ADDED";
exports.INCIDENT_STARTED = "INCIDENT_STARTED";
exports.INCIDENT_CHANGED = "INCIDENT_CHANGED";
exports.INCIDENT_TREATED = "INCIDENT_TREATED";
exports.INCIDENT_ENDED = "INCIDENT_ENDED";
exports.INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
exports.INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";
var IncidentErrors;
(function (IncidentErrors) {
    IncidentErrors[IncidentErrors["MissingResponsible"] = 0] = "MissingResponsible";
    IncidentErrors[IncidentErrors["MissingOwnership"] = 1] = "MissingOwnership";
    IncidentErrors[IncidentErrors["MissingOwnerOrSupport"] = 2] = "MissingOwnerOrSupport";
    IncidentErrors[IncidentErrors["ToManyPeopleShouldSendOnlyOne"] = 3] = "ToManyPeopleShouldSendOnlyOne";
    IncidentErrors[IncidentErrors["ValueNeeded"] = 4] = "ValueNeeded";
    IncidentErrors[IncidentErrors["PaymentMethodNeeded"] = 5] = "PaymentMethodNeeded";
    IncidentErrors[IncidentErrors["TitleNeeded"] = 6] = "TitleNeeded";
})(IncidentErrors = exports.IncidentErrors || (exports.IncidentErrors = {}));
var AddToOwnership;
(function (AddToOwnership) {
    AddToOwnership[AddToOwnership["DoNotAddToOwnership"] = 0] = "DoNotAddToOwnership";
    AddToOwnership[AddToOwnership["AddToNewOwnership"] = 1] = "AddToNewOwnership";
    AddToOwnership[AddToOwnership["AddToExistingOwnership"] = 2] = "AddToExistingOwnership";
})(AddToOwnership = exports.AddToOwnership || (exports.AddToOwnership = {}));
class IncidentsService extends base_service_1.BaseService {
    constructor(databaseManager, dataRunner) {
        super(databaseManager, dataRunner);
    }
    start_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield (yield this.databaseManager)
                .ExecuteTypedJsonSP(exports.INCIDENT_STARTED, "StartIncident", [{ "incident": incident.id },
                { "responsible_id": responsible_id }]);
            return execution;
        });
    }
    reopen_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield (yield this.databaseManager)
                .ExecuteTypedJsonSP(exports.INCIDENT_STARTED, "ReopenIncident", [{ "incident": incident.id },
                { "responsible_id": responsible_id }]);
            return execution;
        });
    }
    cancel_start_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield (yield this.databaseManager)
                .ExecuteTypedJsonSP(exports.INCIDENT_CHANGED, "CancelIncidentStart", [{ "incident": incident.id },
                { "responsible_id": responsible_id }]);
            return execution;
        });
    }
    close_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield (yield this.databaseManager).ExecuteTypedJsonSP(exports.INCIDENT_ENDED, "CloseIncident", [{ "incident": incident.id },
                { "close_description": incident.close_text || "" },
                { "title": incident.title || "" },
                { "responsible_id": responsible_id },
                { "fund_value": incident.fund_value },
                { "payment_method_id": incident.payment_method_id > 0 ?
                        incident.payment_method_id : null }]);
            if (execution.success) {
                try {
                    const IR = yield (yield this.databaseManager).getRepository(Incident_1.Incident);
                    const light_incident = yield IR.findOne(incident.id);
                    if (light_incident.type.id == configurations_services_1.Constants.IncidentTypeOwnership) {
                        yield ownership_closing_report_1.OwnershipClosingReport.send(light_incident.id);
                    }
                }
                catch (ex) {
                    logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.SendingEmail, ex);
                }
            }
            return execution;
        });
    }
    remove_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield (yield this.databaseManager).ExecuteTypedJsonSP(exports.INCIDENT_CANCELLED, "RemoveIncident", [{ "incident": incident.id },
                { "responsible_id": responsible_id }]);
            return execution;
        });
    }
    register_incident2(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const incidents = [];
            for (let person of data.people) {
                let incident_data = data;
                incident_data.people = [person];
                let incident_register = yield this.register_incident_for_person(incident_data);
                if (!incident_register.success) {
                    return incident_register;
                }
                incidents.push(...incident_register.data);
            }
            return result_1.Result.Ok(exports.INCIDENT_ADDED, incidents);
        });
    }
    register_incident_for_person(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.responsible) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.MissingResponsible]));
            }
            if (data.people.length > 1) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.ToManyPeopleShouldSendOnlyOne]));
            }
            var incident = data.incident;
            if (data.start_activity) {
                incident.started_by = data.responsible;
                incident.started_on = new Date();
            }
            if (data.register_closed || data.register_treated) {
                incident.closed_by = data.responsible;
                incident.closed_on = new Date();
                incident.closed = true;
            }
            if (data.register_treated) {
                incident.treated = true;
            }
            if (incident.type.need_value
                && incident.value <= 0) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.ValueNeeded]));
            }
            if (incident.type.require_title
                && (incident.title || "").length <= 0) {
                let error = new Error(IncidentErrors[IncidentErrors.TitleNeeded]);
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, error);
            }
            if (incident.type.require_payment_method
                && incident.payment_method_id <= 0) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.PaymentMethodNeeded]));
            }
            let get_ownership = yield this.get_ownership_for_incident(data);
            if (!get_ownership.success) {
                return get_ownership;
            }
            incident.ownership = get_ownership.data ? get_ownership.data[0] : null;
            incident.people_incidents = [PersonIncident_1.PersonIncident.create(incident, data.people[0])];
            yield this.save(incident);
            return result_1.Result.Ok(exports.INCIDENT_ADDED, [incident]);
        });
    }
    get_ownership_for_incident(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.incident.type.require_ownership
                && data.addToOwnership === AddToOwnership.DoNotAddToOwnership) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.MissingOwnership]));
            }
            switch (data.addToOwnership) {
                case AddToOwnership.AddToExistingOwnership:
                    if (!data.ownership) {
                        return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.MissingOwnership]));
                    }
                    return result_1.Result.GeneralOk(data.ownership[0]);
                case AddToOwnership.AddToNewOwnership:
                    let ownership_result = yield this.generate_ownership_for_incident(data);
                    return ownership_result;
                default:
                    break;
            }
            return result_1.Result.GeneralOk(null);
        });
    }
    generate_ownership_for_incident(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.new_owner || !data.new_support) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ValidationError, new Error(IncidentErrors[IncidentErrors.MissingOwnerOrSupport]));
            }
            let ownership = data.incident;
            ownership.type = (yield (yield this.getRepository(IncidentType_1.IncidentType))
                .findOne(configurations_services_1.Constants.IncidentTypeOwnership));
            if (data.incident.type.need_fund_value) {
                ownership.define_fund_value = true;
            }
            const ownership_result = yield this.register_incident_for_person({
                incident: ownership,
                people: [data.new_owner],
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible,
                addToOwnership: AddToOwnership.DoNotAddToOwnership
            });
            if (!ownership_result.success) {
                return ownership_result;
            }
            let support = data.incident;
            support.type = (yield (yield this.getRepository(IncidentType_1.IncidentType))
                .findOne(configurations_services_1.Constants.IncidentTypeSupport));
            const support_result = yield this.register_incident_for_person({
                incident: support,
                people: [data.new_support],
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible,
                addToOwnership: AddToOwnership.AddToExistingOwnership,
                ownership: ownership_result.data[0]
            });
            if (!support_result.success) {
                return support_result;
            }
            return ownership_result;
        });
    }
    register_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = incident.date;
            if (incident.date && incident.date.year) {
                date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
            }
            if (incident.time) {
                date += ` ${incident.time.hour}:${incident.time.minute}`;
            }
            let execution = yield (yield this.databaseManager)
                .ExecuteTypedJsonSP(exports.INCIDENT_ADDED, "RegisterNewIncident", [{ "description": incident.description },
                { "responsible_id": responsible_id },
                { "people": incident.people.filter(f => f.person_id > 0)
                        .map(p => p.person_id).join(",") },
                { "date": date },
                { "type": incident.type.id },
                { "branch": incident.branch_id },
                { "title": incident.title },
                { "value": incident.value },
                { "start_activity": incident.start_activity ? 1 : 0 },
                { "register_closed": incident.close_activity == 1 ? 1 : 0 },
                { "register_treated": incident.close_activity == 2 ? 1 : 0 },
                { "new_people": incident.people.filter(f => f.person_id == 0)
                        .map(p => p.name.trim()).join(",") },
                { "add_to_ownernership": incident.add_to_ownernership },
                { "new_owner_id": incident.new_owner_id },
                { "new_support_id": incident.new_support_id },
                { "ownership_id": incident.ownership ? incident.ownership.id : null }], (yield this.dataRunner));
            return execution;
        });
    }
    reschedule_incident(incident, new_incident, contact, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield (yield this.databaseManager).ExecuteTypedJsonSP(exports.INCIDENT_RESCHEDULED, "RescheduleIncident", [{ "incident": incident.id },
                { "contact": contact },
                { "new_date": new_incident.date + ' ' + new_incident.start_hour },
                { "responsible_id": responsible_id }]);
            return execution;
        });
    }
    register_contact_for_incident(incident, contact, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let execution = yield (yield this.databaseManager).ExecuteTypedJsonSP(exports.INCIDENT_TREATED, "RegisterContactForIncident", [{ "incident": incident.id },
                { "contact": contact },
                { "responsible_id": responsible_id }]);
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
], IncidentsService.prototype, "start_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "reopen_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "cancel_start_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "close_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "remove_incident", null);
__decorate([
    trylog_decorator_1.trylog2(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "register_incident2", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "register_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "reschedule_incident", null);
__decorate([
    trylog_decorator_1.trylog(),
    firebase_emitter_decorator_1.firebaseEmitter(exports.EVENTS_COLLECTION),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentsService.prototype, "register_contact_for_incident", null);
exports.IncidentsService = IncidentsService;
//# sourceMappingURL=incidents-service.js.map