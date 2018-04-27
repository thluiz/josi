
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

    constructor(sql_pool, private appInsights: any) {
        this.sql_pool = sql_pool;
        this.sumary_service = new SumaryService(sql_pool);
        this.person_service = new PersonService(sql_pool);
        this.card_service = new CardService(sql_pool);
    }

    update_voucher_site() {
        try {
            const start = Date.now();

            axios.get(process.env.VOUCHER_SITE_UPDATE_URL)
            .then(function (response) {
                console.log('voucher site updated!');
            });
        } catch (ex) {
            this.appInsights.trackException(ex, 'update_voucher_site');
        } 
    }
    
    async hourly_jobs() {
        try {
            let start = Date.now();

            await this.card_service.correct_card_out_of_parent_step();
            await this.person_service.generate_birthdate_incidents();
            await this.person_service.cancel_expired_people_scheduling();
            await this.person_service.check_people_status();
            await this.person_service.check_people_comunication_status();
            await this.person_service.check_people_financial_status();
            await this.person_service.check_people_scheduling_status();                        
            await this.card_service.check_cards_has_overdue_cards();            
            await this.sumary_service.consolidate_members_sumary();
            await this.sumary_service.consolidate_activity_sumary();

            let duration = Date.now() - start;
            this.appInsights.defaultClient.trackMetric({name: "hourly jobs duration", value: duration});
        } catch(ex) {
            if(this.appInsights) {
                this.appInsights.trackException(ex, 'hourly_jobs');  
            }

            console.log(ex);
        }
    }
    
}