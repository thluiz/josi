import { SecurityService } from './../services/security-service';
import { DataRunner, DatabaseManager } from './../services/managers/database-manager';
import { IncidentsService } from '../services/incidents-service';
import { Incident } from '../entity/Incident';
import { User } from '../entity/User';

export class IncidentsController {
    private IS : IncidentsService;

    constructor(databaseManager?: DatabaseManager, data_runner? : DataRunner) {
        this.IS = new IncidentsService(databaseManager, data_runner);
    }

    async close_incident(incident_data, user: User) {

        let ir = await this.IS.getRepository(Incident);
        let incident = await ir.findOne(incident_data.id, {relations: [ "type" ]});
        incident.close_text = incident_data.close_text;
        incident.title = incident_data.title;
        incident.payment_method_id = incident_data.payment_method_id;
        incident.fund_value = incident_data.fund_value;

        let result = await this.IS.close_incident_and_send_ownership_report(
            incident, await user.getPerson()
        );

        return result;
    }
}