import { SumaryService } from "./sumary_services";

const sql = require('mssql')

export class JobsService {
    private sql_pool;
    private sumary_service;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
        this.sumary_service = new SumaryService(sql_pool);
    }

    async hourly_jobs() {
        let members_sumary_result  = await this.sumary_service.consolidate_members_sumary();
    }
}