import { DataRunner } from './managers/database-manager';
import { DatabaseManager } from './managers/database-manager';
import { Result, SuccessResult, ErrorResult } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';
import { Person } from '../entity/Person';
import { BaseService } from './base-service';
import { Role } from '../entity/Role';
import { firebaseEmitter } from '../decorators/firebase-emitter-decorator';
import { trylog, trylog2 } from '../decorators/trylog-decorator';

export const PEOPLE_COLLECTION = "people-events";
export const PERSON_ADDED = "PERSON_ADDED";
export const PERSON_UPDATED_ACTION = "PERSON_UPDATED_ACTION";

export interface IPersonVoucherData {
    name : string, email : string, cpf : string, phone : string,
    socialLinks : string, voucher_id: number, branch_map_id : number,
    branch_id? : number, additionalAnswer ? : string, invite_key?: string
}

export class PeopleService extends BaseService {

    constructor(databaseManager? : DatabaseManager, dataRunner? : DataRunner) {
        super(databaseManager, dataRunner);
    }

    @trylog2()
    @firebaseEmitter(PEOPLE_COLLECTION)
    async create_person(name:string, role_id : number)
        : Promise<Result<Person>> {

        const RR = await this.getRepository(Role);
        let person = new Person();

        person.name = name;
        person.is_interested = role_id == 4;
        person.roles = [(await RR.findOne(role_id))];

        await this.save(person);

        return SuccessResult.Ok(PERSON_ADDED, person);
    }

    async check_people_comunication_status(): Promise<Result> {
        return await (await this.databaseManager).ExecuteSPNoResults("CheckPeopleComunicationStatus");
    }

    async check_people_status(): Promise<Result> {
        return await  (await this.databaseManager).ExecuteSPNoResults("CheckPeopleStatus");
    }

    async check_people_financial_status(): Promise<Result> {
        return await  (await this.databaseManager).ExecuteSPNoResults("CheckPeopleFinancialStatus");
    }

    async check_people_scheduling_status(): Promise<Result> {
        return await  (await this.databaseManager).ExecuteSPNoResults("CheckPeopleSchedulingStatus");
    }

    async generate_birthdate_incidents() : Promise<Result> {
        return await  (await this.databaseManager).ExecuteSPNoResults("GenerateBirthDateIncidents");
    }

    async check_people_offering_status() : Promise<Result> {
        return await (await this.databaseManager).ExecuteSPNoResults("GetPersonOfferingAvailable", {
            "save_data": true
        });
    }

    async cancel_expired_people_scheduling(): Promise<Result> {
        return await  (await this.databaseManager).ExecuteSPNoResults("CancelExpiredPeopleScheduling");
    }

    async create_person_from_voucher(data : IPersonVoucherData) {
        return await  (await this.databaseManager).ExecuteSPNoResults("CreatePersonFromVoucher",
            { "name" : data.name },
            { "email" : data.email },
            { "cpf" : data.cpf },
            { "phone" : data.phone },
            { "socialLinks" : data.socialLinks },
            { "branch_id" : data.branch_id },
            { "voucher_id" : data.voucher_id },
            { "additionalAnswer" : data.additionalAnswer },
            { "invite_key" : data.invite_key },
            { "branch_map_id" : data.branch_map_id },
        );
    }

    async save_avatar_image(person_id, blob_image) : Promise<Result<Person>> {
        try {
            const PR = await  (await this.databaseManager)
            .getRepository<Person>(Person);

            const person = await PR.findOne({id: person_id});
            person.avatar_img = blob_image;
            await PR.save(person);

            //TODO: Validate image size

            return SuccessResult.GeneralOk(person);
        } catch (error) {
            //TODO: Remove file from blob
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    async pin_comment(comment_id) : Promise<Result<Person>> {
        const result = await  (await this.databaseManager)
        .ExecuteTypedJsonSP<Person>(PERSON_UPDATED_ACTION,
            "ToglePersonCommentPinned", [{comment_id: comment_id }],
            (await this.dataRunner)
        );

        return result;
    }
}