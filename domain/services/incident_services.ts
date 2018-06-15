const sql = require('mssql')

export class IncidentService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }
    
    async save_comment(incident_id, comment, responsible_id) {
        const result = await new sql.Request(this.sql_pool) 
                                .input('incident_id', sql.Int, incident_id)
                                .input('comment', sql.NVarChar(sql.MAX), comment)                               
                                .input('responsible_id', sql.Int, responsible_id)
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