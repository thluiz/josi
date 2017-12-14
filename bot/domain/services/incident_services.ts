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
        
    public async register_incident(incident) {
        let date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
        if(incident.time) {
            date += ` ${incident.time.hour}:${incident.time.minute}`;
        }        

        try {
            const result = await this.sql_pool
            .request()
            .input('description', sql.VarChar(sql.MAX), incident.description)
            .input('people', sql.VarChar(sql.MAX), incident.people.map(p => p.person_id).join(","))
            .input('date', sql.VarChar(100), date)        
            .input('type', sql.Int, incident.type.id)
            .input('branch', sql.Int, incident.branch.id)
            .input('value', sql.Decimal(12,2), incident.value)
            .execute(`RegisterNewIncident`);
        } catch(ex) {
            console.log(ex);
        }
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