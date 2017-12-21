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
    close_incident(incident) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sql_pool
                .request()
                .input('id', sql.Int, incident.id)
                .input('close_description', sql.VarChar(sql.MAX), incident.closing_contact_text || "")
                .execute(`CloseIncident`);
            return result;
        });
    }
    remove_incident(incident) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.sql_pool
                    .request()
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
                console.log(incident.people.filter(f => f.person_id == 0).map(p => p.name.trim()).join(","));
                console.log(incident.people.filter(f => f.person_id > 0).map(p => p.person_id).join(","));
                const result = yield this.sql_pool
                    .request()
                    .input('description', sql.VarChar(sql.MAX), incident.description)
                    .input('people', sql.VarChar(sql.MAX), incident.people.filter(f => f.person_id > 0).map(p => p.person_id).join(","))
                    .input('date', sql.VarChar(100), date)
                    .input('type', sql.Int, incident.type.id)
                    .input('branch', sql.Int, incident.branch.id)
                    .input('value', sql.Decimal(12, 2), incident.value)
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
            const result = yield this.sql_pool
                .request()
                .input('id', sql.Int, incident.id)
                .input('new_date', sql.VarChar(16), new_incident.date + ' ' + new_incident.start_hour)
                .input('contact', sql.VarChar(sql.MAX), contact)
                .execute(`RescheduleIncident`);
        });
    }
    register_contact_for_incident(incident, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sql_pool
                .request()
                .input('id', sql.Int, incident.id)
                .input('contact', sql.VarChar(sql.MAX), text)
                .execute(`RegisterContactForIncident`);
        });
    }
}
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident_services.js.map