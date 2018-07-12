import { PeopleService } from "./people-service";
import { CardsService } from "./cards-service";
import { DatabaseFacility } from "../facilities/database-facility";
import { Result } from "../helpers/result";
import axios, { AxiosResponse } from 'axios';
import { ErrorCode } from "../helpers/errors-codes";
import { Observable, from, concat, zip } from 'rxjs';
import { trylog } from "../decorators/trylog-decorator";
import { LoggerService, LogOrigins, LogLevel } from "./logger-service";
import { IncidentsRepository }  from "../repositories/incidents-repository";

import * as uuid from "uuid/v4";
import to from 'await-to-js'
import sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import path = require('path');
import Ejs = require('ejs');

let IR = IncidentsRepository;

export const HOURLY_JOB_EXECUTION = "HOURLY_JOB_EXECUTION";

export class JobsService {

    @trylog()
    static async execute_hourly_jobs(): Promise<Result<void>> {
        console.log('Start running jobs...');
        let start_time = new Date().getTime();
        let key = uuid();
        LoggerService.benchmark(key, "Starting Running Jobs", { start_time });

        let results = [];
        results.push(await PeopleService.generate_birthdate_incidents());
        results.push(await PeopleService.cancel_expired_people_scheduling());
        results.push(await PeopleService.check_people_status());
        results.push(await PeopleService.check_people_comunication_status());
        results.push(await PeopleService.check_people_financial_status());
        results.push(await PeopleService.check_people_scheduling_status());
        results.push(await CardsService.correct_card_out_of_parent_step());
        results.push(await CardsService.check_cards_has_overdue_cards());
        results.push(await this.consolidate_members_sumary());
        results.push(await this.consolidate_activity_sumary());
        results.push(await this.cleanup_sessions());

        let end_time = new Date().getTime();

        let err = results.find(r => !r.success);

        LoggerService.benchmark(key, HOURLY_JOB_EXECUTION, {
            start_time,
            success: err == null,
            end_time,
            duration: (end_time - start_time)/1000,
            results
        });

        console.log("Finished running jobs!");

        if(err) return err;

        return Result.GeneralOk();
    }

    @trylog()
    static async cleanup_sessions(): Promise<Result<any>> {
        const AzureSessionStore = require('../middlewares/azure-session-storage');
        const storage = new AzureSessionStore();

        try {
            let results = await storage.cleanup();

            return results;
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);
        }
    }

    @trylog()
    static async update_voucher_site(): Promise<Result<AxiosResponse>> {
        let [ err_voucher, result_voucher ] = await to(axios.get(process.env.VOUCHER_SITE_UPDATE_URL));

        if(err_voucher || result_voucher.status != 200)
            return Result.Fail(ErrorCode.ExternalRequestError, err_voucher || new Error(result_voucher.statusText), null);

        let [ err_invites, result_invites ] = await to(axios.get(process.env.VOUCHER_SITE_UPDATE_INVITES_URL));

        if(err_invites || result_invites.status != 200)
            return Result.Fail(ErrorCode.ExternalRequestError, err_invites || new Error(result_invites.statusText), null);

        return Result.GeneralOk();
    }

    @trylog()
    static async send_ownership_closing_report(id : number): Promise<Result> {
        
        var templatePath = path.join(__dirname, "../template/ownership_closing_report.html");
        let ow_data_request = await IR.getOwnershipData(id);
        let data = ow_data_request.data;
        let content = "";
        try {
            const generated_content = await this.render_template(templatePath, data);    
            content = generated_content.data;
        } catch (error) {
            content = `Error rendering content ${error.message}`    
        }
                
        const msg = {
            to: 'th.luiz@gmail.com',
            from: 'contato@myvtmi.im',
            subject: `Fechamento de titularidade - ${ data.branch_name } `,        
            html: content,
        };

        try {
            console.log(msg.to);
            await this.send_email(msg);    
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);
        }
        
        return Result.Ok("GENERIC_ACTION", { content, data });
    }

    private static render_template(template_path, data): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            Ejs.renderFile(template_path, { data: data }, (err, content) => {                            
                if(err) {
                    reject(err);
                    return;
                }

                resolve(Result.GeneralOk(content));                
            });
        });
    }

    private static send_email(msg) : Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            sgMail.send(msg)
            .then(r2 =>  { 
                console.log(r2);
                resolve(Result.GeneralOk(r2));                    
            })
            .catch(error => {                
                console.error(error.toString());
            
                //Extract error msg
                const {message, code, response} = error;                
                //Extract response msg
                const {headers, body} = response;

                console.log(code);
                console.log(headers);
                console.log(body);                    

                reject(error);                
            });
        });
    }

    @trylog()
    static async consolidate_members_sumary(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("ConsolidateMembersSumary");
    }

    @trylog()
    static async consolidate_activity_sumary(): Promise<Result> {
        return await DatabaseFacility.ExecuteSPNoResults("ConsolidateActivitySumary");
    }
}