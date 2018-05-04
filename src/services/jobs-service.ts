import {  } from 'rxjs/operators';
import { PeopleService } from "./people-service";
import { CardsService } from "./cards-service";
import { DatabaseFacility } from "../facilities/database-facility";
import axios, { AxiosResponse } from 'axios';
import to from "await-to-js";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";
import { Observable, from, concat, zip } from 'rxjs';

export class JobsService {
    static async execute_hourly_jobs(): Promise<Result<void>> {
        console.log('start running jobs...');

        let results = [];
        results.push(await PeopleService.generate_birthdate_incidents());
        results.push(await PeopleService.cancel_expired_people_scheduling());
        results.push(await PeopleService.check_people_status());
        results.push(await PeopleService.check_people_comunication_status());
        results.push(await PeopleService.check_people_financial_status());
        results.push(await PeopleService.check_people_scheduling_status());
        results.push(await CardsService.correct_card_out_of_parent_step());
        results.push(await CardsService.check_cards_has_overdue_cards());
        results.push(await this.consolidate_activity_sumary());
        results.push(await this.consolidate_activity_sumary());

        console.log('...finished jobs!');

        let err = results.find(r => !r.success);
        if(err) return err;

        return Result.Ok();       
    }

    static async update_voucher_site(): Promise<Result<AxiosResponse>> {
        try {
            let result_voucher = await axios.get(process.env.VOUCHER_SITE_UPDATE_URL);

            if(result_voucher.status != 200)                    
                return Result.Fail(ErrorCode.ExternalRequestError, new Error(result_voucher.statusText), null);

            let result_invites = await axios.get(process.env.VOUCHER_SITE_UPDATE_INVITES_URL);

            if(result_invites.status != 200)                    
                return Result.Fail(ErrorCode.ExternalRequestError, new Error(result_invites.statusText), null);

            return Result.Ok();
        } catch (error) {            
            return Result.Fail(ErrorCode.GenericError, error)
        }
    }

    static async consolidate_members_sumary(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("ConsolidateMembersSumary");
    }

    static async consolidate_activity_sumary(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("ConsolidateActivitySumary");
    }
}