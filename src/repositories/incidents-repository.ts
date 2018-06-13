import { DatabaseFacility } from "../facilities/database-facility";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";
import { trylog } from "../decorators/trylog-decorator";

export class IncidentsRepository{
    
    @trylog()
    static async getCurrentActivities(branch_id) : Promise<Result<any>> {        
        let result = await DatabaseFacility.ExecuteJsonSP("GetCurrentActivities",
            { "branch_id":  branch_id }
        );
        
        return result;
    }

    @trylog()
    static async getPeopleSummary(branch_id, week_modifier, date) : Promise<Result<any>> {        
        return await DatabaseFacility.ExecuteJsonSP("GetPeopleSummary",
            { "branch":  branch_id },
            { "week_modifier":  week_modifier },
            { "date":  date }
        );
    }

    @trylog()
    static async getSummary(branch_id, month_modifier, week_modifier, date) : Promise<Result<any>> {        
        return await DatabaseFacility.ExecuteJsonSP("GetPeopleSummary",
            { "branch":  branch_id },
            { "month_modifier" : month_modifier },
            { "week_modifier":  week_modifier },
            { "date":  date }
        );
    }

    @trylog()
    static async getDailyMonitor(branch_id, display, display_modifier ) : Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetDailyMonitor2", 
            { "branch": branch_id },
            { "display_modifier":  display_modifier },
            { "display": display }
        );
    }

    @trylog()
    static async getPersonIncidentsHistory(person_id, start_date, end_date, activity_type) : Promise<Result<any>> {        
        return await DatabaseFacility.ExecuteJsonSP("GetPersonIncidentHistory2",            
            { "person_id":  person_id },
            { "start_date":  start_date },
            { "end_date":  end_date },
            { "activity_type": activity_type }
        );
    }

    @trylog()
    static async getIncidentDetails(incident_id) : Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetIncidentDetails", 
            { "id":  incident_id }
        );
    }

    @trylog()
    static async getAgenda(branch_id, date) : Promise<Result<any>> {        
        return await DatabaseFacility.ExecuteJsonSP("GetAgenda2",
            { "branch_id":  branch_id },
            { "date":  date }
        );
    }
}