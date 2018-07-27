import { DatabaseFacility } from './../facilities/database-facility';
import to from 'await-to-js';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';
import { Person } from '../entity/Person';

export interface IPersonVoucherData {
    name : string, email : string, cpf : string, phone : string,
    socialLinks : string, voucher_id: number, branch_map_id : number,
    branch_id? : number, additionalAnswer ? : string, invite_key?: string
}

export class PeopleService {
    static async check_people_comunication_status(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleComunicationStatus");
    }

    static async check_people_status(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleStatus");
    }

    static async check_people_financial_status(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleFinancialStatus");
    }

    static async check_people_scheduling_status(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("CheckPeopleSchedulingStatus");
    }

    static async generate_birthdate_incidents() : Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("GenerateBirthDateIncidents");
    }

    static async check_people_offering_status() : Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("GetPersonOfferingAvailable", {
            "save_data": true
        });
    }

    static async cancel_expired_people_scheduling(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("CancelExpiredPeopleScheduling");
    }

    static async create_person_from_voucher(data : IPersonVoucherData) {
        return await DatabaseFacility.ExecuteSPNoResults("CreatePersonFromVoucher",
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

    static async save_avatar_image(person_id, blob_image) : Promise<Result<Person>> {
        try {
            const PR = await DatabaseFacility.getRepository<Person>(Person);
            const person = await PR.findOne({id: person_id});
            person.avatar_img = blob_image;
            await PR.save(person);

            //TODO: Validate image size

            return Result.GeneralOk(person);
        } catch (error) {
            //TODO: Remove file from blob
            return Result.Fail(ErrorCode.GenericError, error);
        }
    }
}