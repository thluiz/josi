import { DatabaseFacility } from './../facilities/database-facility';
import to from 'await-to-js';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';

export class PeopleService {
    static async check_people_comunication_status(): Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleComunicationStatus");
    }

    static async check_people_status(): Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleStatus");  
    }

    static async check_people_financial_status(): Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleFinancialStatus");        
    }

    static async check_people_scheduling_status(): Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleSchedulingStatus");
    }

    static async generate_birthdate_incidents() : Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("GenerateBirthDateIncidents");
    }

    static async cancel_expired_people_scheduling(): Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("CancelExpiredPeopleScheduling");           
    }
}