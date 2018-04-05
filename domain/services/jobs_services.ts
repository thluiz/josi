
import { SumaryService } from "./sumary_services";
import { PersonService } from "./person_services";
import { CardService } from "./card_services";

import axios from 'axios';

const sql = require('mssql');

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

    update_voucher_site() {
        try {
            axios.get(process.env.VOUCHER_SITE_UPDATE_URL)
            .then(function (response) {
                console.log('voucher site updated!')
            });
        } catch (err) {
            
        } 
    }
    
    async hourly_jobs() {
        try {
            this.card_service.correct_card_out_of_parent_step();
            this.person_service.generate_birthdate_incidents();
            this.person_service.cancel_expired_people_scheduling();
            this.person_service.check_people_status();
            this.person_service.check_people_comunication_status();
            this.person_service.check_people_financial_status();
            this.person_service.check_people_scheduling_status();                        
            this.card_service.check_cards_has_overdue_cards();            
            this.sumary_service.consolidate_members_sumary();
            this.sumary_service.consolidate_activity_sumary();
        } catch(ex) {
            console.log(ex);
        }
    }
    
}