import { DatabaseFacility } from "../facilities/database-facility";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";

export class IncidentsRepository{
    static async getPersonIncidentsHistory(person_id, activity_type, page = 1, pagesize = 10) : Promise<Result<any>> {
        try {
            let result = await DatabaseFacility.ExecuteJsonSP("GetPersonIncidentHistory", [
                { "page":  page },
                { "person_id":  person_id },
                { "activity_type": activity_type }
            ]);       

            return Result.Ok(result);
        } catch (error) {
            return Result.Fail(ErrorCode.FailedGetConnection, error);
        }        
    }
}