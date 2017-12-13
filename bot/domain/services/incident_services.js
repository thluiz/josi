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
                .execute(`CloseIncident`);
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