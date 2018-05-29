import { DatabaseFacility } from "../facilities/database-facility";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";

export class IncidentsRepository{
    static async getCurrentActivities(branch_id) {
        let result = await DatabaseFacility.ExecuteJsonSP("GetCurrentActivities",
            { "branch_id":  branch_id }
        );               

        return result;        
    }

    static async getPersonIncidentsHistory(person_id, activity_type, page = 1, pagesize = 10) : Promise<Result<any>> {        

        let result = await DatabaseFacility.ExecuteJsonSP("GetPersonIncidentHistory",
            { "page":  page },
            { "person_id":  person_id },
            { "activity_type": activity_type }
        );       

        return result;        
    }

    static async getIncidentDetails(incident_id) : Promise<Result<any>> {
        let result = await DatabaseFacility.ExecuteJsonSP("GetIncidentDetails", 
            { "id":  incident_id }
        );       

        return result;        
    }

    static async getAgenda(branch_id, date) : Promise<Result<any>> {        
        let result = await DatabaseFacility.ExecuteJsonSP("GetAgenda2",
            { "branch_id":  branch_id },
            { "date":  date }
        );       

        return result;        
    }
}