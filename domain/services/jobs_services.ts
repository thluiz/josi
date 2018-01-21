import { SumaryService } from "./sumary_services";
import { PersonService } from "./person_services";

const sql = require('mssql')

export class JobsService {
    private sql_pool;
    private sumary_service;
    private person_service;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
        this.sumary_service = new SumaryService(sql_pool);
        this.person_service = new PersonService(sql_pool);
    }

    async hourly_jobs() {
        try {
            this.sumary_service.consolidate_members_sumary();
            this.sumary_service.consolidate_activity_sumary();
            this.person_service.check_people_status();
        } catch(ex) {
            console.log(ex);
        }
    }
}