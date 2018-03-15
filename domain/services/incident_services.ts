const sql = require('mssql')

export class IncidentService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }

    public async start_incident(incident, responsible_id) {
        const result = await new sql.Request(this.sql_pool)
                                .input('incident', sql.Int, incident.id) 
                                .input('responsible_id', sql.Int, responsible_id)                                
                                .execute(`StartIncident`);

        return result;                        
    }

    public async reopen_incident(incident, responsible_id) {
        const result = await new sql.Request(this.sql_pool)
                                .input('id', sql.Int, incident.id)   
                                .input('responsible_id', sql.Int, responsible_id)                              
                                .execute(`ReopenIncident`);

        return result;                        
    }

    public async cancel_start_incident(incident, responsible_id) {
        const result = await new sql.Request(this.sql_pool)
                                .input('incident', sql.Int, incident.id)                                
                                .input('responsible_id', sql.Int, responsible_id) 
                                .execute(`CancelIncidentStart`);

        return result;                        
    }
    
    public async close_incident(incident, responsible_id) {
        const result = await new sql.Request(this.sql_pool)
                                .input('id', sql.Int, incident.id)
                                .input('close_description', sql.VarChar(sql.MAX), incident.closing_contact_text || "")                        
                                .input('responsible_id', sql.Int, responsible_id) 
                                .execute(`CloseIncident`);

        return result;                        
    }

    public async remove_incident(incident) {        
        try {            
            const result = await new sql.Request(this.sql_pool)                                    
                                    .input('id', sql.Int, incident.id)        
                                    .execute(`RemoveIncident`);

            return result;

        } catch(ex) {
            console.log(ex);
        }        
    }
        
    public async register_incident(incident) {
        let date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
        if(incident.time) {
            date += ` ${incident.time.hour}:${incident.time.minute}`;
        }        

        try {            
            const result = await new sql.Request(this.sql_pool)
            .input('description', sql.VarChar(sql.MAX), incident.description)
            .input('people', sql.VarChar(sql.MAX), incident.people.filter(f => f.person_id > 0).map(p => p.person_id).join(","))
            .input('date', sql.VarChar(100), date)        
            .input('type', sql.Int, incident.type.id)
            .input('branch', sql.Int, incident.branch_id)
            .input('value', sql.Decimal(12,2), incident.value)
            .input('new_people', sql.VarChar(sql.MAX), incident.people.filter(f => f.person_id == 0).map(p => p.name.trim()).join(","))
            .execute(`RegisterNewIncident`);
            
            return result;
        } catch(ex) {
            console.log(ex);
        }
    }

    public async reschedule_incident(incident, new_incident, contact) {
        const result = await new sql.Request(this.sql_pool)
        .input('id', sql.Int, incident.id)
        .input('new_date', sql.VarChar(16), new_incident.date + ' ' + new_incident.start_hour)
        .input('contact', sql.VarChar(sql.MAX), contact)
        .execute(`RescheduleIncident`);
    }
    
    public async register_contact_for_incident(incident, text) {
        const result = await new sql.Request(this.sql_pool)
        .input('id', sql.Int, incident.id)
        .input('contact', sql.VarChar(sql.MAX), text)
        .execute(`RegisterContactForIncident`);
    }

    async save_comment(incident_id, comment) {
        const result = await new sql.Request(this.sql_pool) 
                                .input('incident_id', sql.Int, incident_id)
                                .input('comment', sql.NVarChar(sql.MAX), comment)                               
                                .execute(`SaveIncidentComment`);

        return result;  
    }

    async archive_comment(comment_id) {        
        const result = await new sql.Request(this.sql_pool) 
                                .input('comment_id', sql.Int, comment_id)                                
                                .execute(`TogleIncidentCommentArchived`);

        return result;
    }
}