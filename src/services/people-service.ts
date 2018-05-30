import { DatabaseFacility } from './../facilities/database-facility';
import to from 'await-to-js';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';
import { Person } from '../entity/Person';

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

    static async save_avatar_image(person_id, blob_image) : Promise<Result<Person>> {
        try {
            const PR = await DatabaseFacility.getRepository<Person>(Person);
            const person = await PR.findOne({id: person_id});
            person.avatar_img = blob_image;
            await PR.save(person);

            //TODO: Validar tamanho da imagem
    
            return Result.GeneralOk(person);            
        } catch (error) {
            //TODO: Remove file from blob
            return Result.Fail(ErrorCode.GenericError, error);            
        }
    }
}