import { Repository } from 'typeorm';
import { DatabaseFacility } from "../facilities/database-facility";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";
import { trylog } from "../decorators/trylog-decorator";
import showdown = require('showdown');
import { Person } from '../entity/Person';

export class PeopleRepository {

    @trylog()
    static async getRepository(): Promise<Repository<Person>> {
        return await DatabaseFacility.getRepository<Person>(Person);
    }

    @trylog()
    static async getExternalContacts(branch_id: number, voucher_id: number,
    name: string, voucher_status: number, people_per_page: number, page: number)
    : Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetExternalContacts",
            { "branch_id": branch_id },
            { "voucher_id": voucher_id },
            { "name": name },
            { "voucher_status": voucher_status },
            { "people_per_page": people_per_page },
            { "page": page },
        );
    }
}