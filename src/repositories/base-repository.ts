import { DatabaseManager } from "../services/managers/database-manager";
import { DependencyManager } from "../services/managers/dependency-manager";

import { Repository } from "typeorm";
import { trylog2 } from "../decorators/trylog-decorator";

export class BaseRepository<T> {
    protected type;
    protected DBM = DependencyManager.container.resolve(DatabaseManager);

    @trylog2()
    async getRepository(): Promise<Repository<T>> {
        return await this.DBM.getRepository<T>(this.type);
    }
}
