import { QueryRunner, EntitySchema, Entity } from 'typeorm';
import { DataRunner, DatabaseManager } from "./managers/database-manager";

export class BaseService {
    constructor(private _databaseManager: DatabaseManager, private _dataRunner? : DataRunner) {

    }

    get databaseManager() : Promise<DatabaseManager> {
        return (async () => {
            if(!this._databaseManager) {
                this._databaseManager = new DatabaseManager();
            }

            return this._databaseManager;
        })();
    }

    get dataRunner() : Promise<DataRunner> {
        return (async () => {
            if(this._dataRunner) {
                return this._dataRunner;
            }

            let conn = await (await this.databaseManager).getConnection();

            this._dataRunner = {
                runner: await conn.createQueryRunner(),
                useTransaction: false,
                shouldCommit: false
            }

            return this._dataRunner;
        })();
    }

    get queryRunner() : Promise<QueryRunner>  {
        return (async () => {
            return (await this.dataRunner).runner;
        })();
    }

    async getRepository<T>(type: string | Function | (new () => any) | EntitySchema<T>) {
        return (await this.queryRunner).manager.getRepository(type);
    }

    async save<T>(entity : T) {
        return (await this.queryRunner).manager.save(entity);
    }
    async create<T>(entityClass : string | Function | (new () => any) | EntitySchema<T>, object : any) {
        let manager = (await this.queryRunner).manager;

        return manager.create(entityClass, object);
    }
}