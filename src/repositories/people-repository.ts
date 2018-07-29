import { Repository, QueryRunner } from 'typeorm';
import { DatabaseManager } from "../services/managers/database-manager";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";
import { trylog } from "../decorators/trylog-decorator";
import showdown = require('showdown');
import { Person } from '../entity/Person';

const DBM = new DatabaseManager();

export class PeopleRepository {

    @trylog()
    static async getRepository(runner? : QueryRunner)
        : Promise<Repository<Person>> {
        return await DBM.getRepository<Person>(Person, runner);
    }

    @trylog()
    static async getExternalContacts(branch_id: number, voucher_id: number,
    name: string, voucher_status: number, people_per_page: number, page: number)
    : Promise<Result<any>> {
        return await DBM.ExecuteJsonSP("GetExternalContacts",
            { "branch_id": branch_id },
            { "voucher_id": voucher_id },
            { "name": name },
            { "voucher_status": voucher_status },
            { "people_per_page": people_per_page },
            { "page": page },
        );
    }
}