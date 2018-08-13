import { Result } from "../helpers/result";
import { DatabaseManager } from "../services/managers/database-manager";

import { trylog2 } from "../decorators/trylog-decorator";
import { DependencyManager } from "../services/managers/dependency-manager";

export class CardsRepository {
    private DBM = DependencyManager.container.resolve(DatabaseManager);

    @trylog2()
    async getOrganizations(id?: number, includeChildrens = false): Promise<Result<any>> {
        return await this.DBM.ExecuteJsonSP("GetOrganizations",
            { organization_id:  id > 0 ? id : null },
            { include_childrens:  includeChildrens ? 1 : 0 },
        );
    }

    @trylog2()
    async getProject(id: number): Promise<Result<any>> {
        return await this.DBM.ExecuteJsonSP("GetProject",
            { project_id:  id }
        );
    }
}
