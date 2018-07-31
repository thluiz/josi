const sql = require('mssql')

export class IncidentService {
    private sql_pool;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }


}