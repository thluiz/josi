const sql = require('mssql')

export class IncidentService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }

    public async close_incident(incident) {
        const result = await this.sql_pool
                        .request()
                        .input('id', sql.Int, incident.id)
                        .execute(`CloseIncident`);
    }
    
    public async reschedule_incident(incident, new_incident, contact) {
        const result = await this.sql_pool
        .request()
        .input('id', sql.Int, incident.id)
        .input('new_date', sql.VarChar(16), new_incident.date + ' ' + new_incident.start_hour)
        .input('contact', sql.VarChar(sql.MAX), contact)
        .execute(`RescheduleIncident`);
    }
    
    public async register_contact_for_incident(incident, text) {
        const result = await this.sql_pool
        .request()
        .input('id', sql.Int, incident.id)
        .input('contact', sql.VarChar(sql.MAX), text)
        .execute(`RegisterContactForIncident`);
    }
}