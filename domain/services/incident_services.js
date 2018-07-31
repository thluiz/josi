"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require('mssql');
class IncidentService {
    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }
}
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident_services.js.map