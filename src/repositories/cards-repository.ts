import { DatabaseManager } from "../services/managers/database-manager";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";
import { trylog } from "../decorators/trylog-decorator";

let DBM = new DatabaseManager();

export class CardsRepository{

    @trylog()
    static async getOrganizations(id?: number, include_childrens = false) : Promise<Result<any>> {
        let result = await DBM.ExecuteJsonSP("GetOrganizations",
            { "organization_id":  id > 0 ? id : null },
            { "include_childrens":  include_childrens ? 1 : 0 },
        );

        return result;
    }

    @trylog()
    static async getProject(id: number) : Promise<Result<any>> {
        let result = await DBM.ExecuteJsonSP("GetProject",
            { "project_id":  id }
        );

        return result;
    }
}