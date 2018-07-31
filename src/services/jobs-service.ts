import { PeopleService } from "./people-service";
import { CardsService } from "./cards-service";
import { DatabaseManager } from "./managers/database-manager";
import { Result, ErrorResult, SuccessResult } from "../helpers/result";
import axios, { AxiosResponse } from 'axios';
import { ErrorCode } from "../helpers/errors-codes";
import { trylog } from "../decorators/trylog-decorator";
import { LoggerService } from "./logger-service";

import * as uuid from "uuid/v4";
import to from 'await-to-js'
import sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let DBM = new DatabaseManager();
let PS = new PeopleService(DBM);

export class JobsService {

    @trylog()
    static async execute_hourly_jobs(): Promise<Result<void>> {
        console.log('Start running jobs...');
        let start_time = new Date().getTime();
        let key = uuid();
        LoggerService.benchmark(key, `Starting Running Jobs :: ${start_time }`);

        let results = [];
        results.push(await PS.generate_birthdate_incidents());
        results.push(await PS.cancel_expired_people_scheduling());
        results.push(await PS.check_people_status());
        results.push(await PS.check_people_comunication_status());
        results.push(await PS.check_people_financial_status());
        results.push(await PS.check_people_scheduling_status());
        results.push(await PS.check_people_offering_status());
        results.push(await CardsService.correct_card_out_of_parent_step());
        results.push(await CardsService.check_cards_has_overdue_cards());
        results.push(await this.consolidate_members_sumary());
        results.push(await this.consolidate_activity_sumary());
        results.push(await this.cleanup_sessions());

        let end_time = new Date().getTime();

        let err = results.find(r => !r.success);

        LoggerService.benchmark(key, {
            start_time,
            success: err == null,
            end_time,
            duration: (end_time - start_time) / 1000,
            results
        });

        console.log("Finished running jobs!");

        if (err) return err;

        return SuccessResult.GeneralOk();
    }

    @trylog()
    static async cleanup_sessions(): Promise<Result<any>> {
        const AzureSessionStore = require('../middlewares/azure-session-storage');
        const storage = new AzureSessionStore();

        try {
            let results = await storage.cleanup();

            return results;
        } catch (error) {
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }

    @trylog()
    static async update_voucher_site(): Promise<Result<AxiosResponse>> {
        let [err_voucher, result_voucher] = await to(axios.get(process.env.VOUCHER_SITE_UPDATE_URL));

        if (err_voucher || result_voucher.status != 200)
            return ErrorResult.Fail(ErrorCode.ExternalRequestError, err_voucher || new Error(result_voucher.statusText), null);

        let [err_invites, result_invites] = await to(axios.get(process.env.VOUCHER_SITE_UPDATE_INVITES_URL));

        if (err_invites || result_invites.status != 200)
            return ErrorResult.Fail(ErrorCode.ExternalRequestError, err_invites || new Error(result_invites.statusText), null);

        return SuccessResult.GeneralOk();
    }

    @trylog()
    static async consolidate_members_sumary(): Promise<Result> {
        return await DBM.ExecuteSPNoResults("ConsolidateMembersSumary");
    }

    @trylog()
    static async consolidate_activity_sumary(): Promise<Result> {
        return await DBM.ExecuteSPNoResults("ConsolidateActivitySumary");
    }
}