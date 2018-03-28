"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sumary_services_1 = require("./sumary_services");
const person_services_1 = require("./person_services");
const card_services_1 = require("./card_services");
const sql = require('mssql');
class JobsService {
    constructor(sql_pool) {
        this.sql_pool = sql_pool;
        this.sumary_service = new sumary_services_1.SumaryService(sql_pool);
        this.person_service = new person_services_1.PersonService(sql_pool);
        this.card_service = new card_services_1.CardService(sql_pool);
    }
    hourly_jobs() {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (ex) {
                console.log(ex);
            }
        });
    }
}
exports.JobsService = JobsService;
//# sourceMappingURL=jobs_services.js.map