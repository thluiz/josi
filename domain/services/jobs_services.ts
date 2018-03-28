
import { SumaryService } from "./sumary_services";
import { PersonService } from "./person_services";
import { CardService } from "./card_services";

const sql = require('mssql')

export class JobsService {
    private sql_pool;
    private sumary_service : SumaryService;
    private person_service: PersonService;
    private card_service : CardService;

    constructor(sql_pool) {
        this.sql_pool = sql_pool;
        this.sumary_service = new SumaryService(sql_pool);
        this.person_service = new PersonService(sql_pool);
        this.card_service = new CardService(sql_pool);
    }
    
    async hourly_jobs() {
        try {
            this.sumary_service.consolidate_members_sumary();
            this.sumary_service.consolidate_activity_sumary();
            this.person_service.cancel_expired_people_scheduling();
            this.person_service.check_people_status();
            this.person_service.check_people_comunication_status();
            this.person_service.check_people_financial_status();
            this.person_service.check_people_scheduling_status();            
            this.person_service.generate_birthdate_incidents();
            this.card_service.check_cards_has_overdue_cards();
            this.card_service.correct_card_out_of_parent_step();
        } catch(ex) {
            console.log(ex);
        }
    }
    
}