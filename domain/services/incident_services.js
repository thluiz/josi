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
const sql = require('mssql');
class IncidentService {
    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }
    start_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('incident', sql.Int, incident.id)
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`StartIncident`);
            return result;
        });
    }
    reopen_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('id', sql.Int, incident.id)
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`ReopenIncident`);
            return result;
        });
    }
    cancel_start_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('incident', sql.Int, incident.id)
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`CancelIncidentStart`);
            return result;
        });
    }
    close_incident(incident, responsible_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('id', sql.Int, incident.id)
                .input('close_description', sql.VarChar(sql.MAX), incident.closing_contact_text || "")
                .input('responsible_id', sql.Int, responsible_id)
                .execute(`CloseIncident`);
            return result;
        });
    }
    remove_incident(incident) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield new sql.Request(this.sql_pool)
                    .input('id', sql.Int, incident.id)
                    .execute(`RemoveIncident`);
                return result;
            }
            catch (ex) {
                console.log(ex);
            }
        });
    }
    register_incident(incident) {
        return __awaiter(this, void 0, void 0, function* () {
            let date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
            if (incident.time) {
                date += ` ${incident.time.hour}:${incident.time.minute}`;
            }
            try {
                const result = yield new sql.Request(this.sql_pool)
                    .input('description', sql.VarChar(sql.MAX), incident.description)
                    .input('people', sql.VarChar(sql.MAX), incident.people.filter(f => f.person_id > 0).map(p => p.person_id).join(","))
                    .input('date', sql.VarChar(100), date)
                    .input('type', sql.Int, incident.type.id)
                    .input('branch', sql.Int, incident.branch_id)
                    .input('value', sql.Decimal(12, 2), incident.value)
                    .input('start_activity', sql.Int, incident.start_activity ? 1 : 0)
                    .input('register_closed', sql.Int, incident.close_activity ? 1 : 0)
                    .input('new_people', sql.VarChar(sql.MAX), incident.people.filter(f => f.person_id == 0).map(p => p.name.trim()).join(","))
                    .execute(`RegisterNewIncident`);
                return result;
            }
            catch (ex) {
                console.log(ex);
            }
        });
    }
    reschedule_incident(incident, new_incident, contact) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('id', sql.Int, incident.id)
                .input('new_date', sql.VarChar(16), new_incident.date + ' ' + new_incident.start_hour)
                .input('contact', sql.VarChar(sql.MAX), contact)
                .execute(`RescheduleIncident`);
        });
    }
    register_contact_for_incident(incident, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('id', sql.Int, incident.id)
                .input('contact', sql.VarChar(sql.MAX), text)
                .execute(`RegisterContactForIncident`);
        });
    }
    save_comment(incident_id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('incident_id', sql.Int, incident_id)
                .input('comment', sql.NVarChar(sql.MAX), comment)
                .execute(`SaveIncidentComment`);
            return result;
        });
    }
    archive_comment(comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('comment_id', sql.Int, comment_id)
                .execute(`TogleIncidentCommentArchived`);
            return result;
        });
    }
}
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident_services.js.map