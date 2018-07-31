import { IMessage } from '../managers/email-manager';
import { BaseReport } from "./base-report";
import { Result, SuccessResult } from "../../helpers/result";

import { IncidentsRepository } from "../../repositories/incidents-repository";
import { ConfigurationsService } from '../configurations-services';
import { Incident } from '../../entity/Incident';

let IR = IncidentsRepository;

export class OwnershipClosingReport extends BaseReport {
    static template_name = "ownership_closing_report";

    private static async buildRecipients(branch_id) : Promise<string[]> {
        let result = [ ConfigurationsService.EMAIL_DEV ];

        const branch_email = await this.getBranchEmail(branch_id);
        if(branch_email && branch_email.length > 0) {
            result.push(branch_email);
        }

        const im_email = await this.getIMEmail();
        if(im_email && im_email.length > 0) {
            result.push(im_email);
        }

        return result;
    }

    static async send(ownership: Incident): Promise<Result> {
        let ow_data_request = await IR.getOwnershipData(ownership.id);
        let data = ow_data_request.data;

        const generated_content = await this.render_template(this.template_name, data);
        if(!generated_content.success) {
            return generated_content;
        }

        const msg : IMessage = {
            to: (await this.buildRecipients(data.branch_id)),
            from: 'contato@myvtmi.im',
            subject: `Fechamento de titularidade - ${data.branch_name} `,
            html: generated_content.data,
        };

        await this.send_email(msg);

        return SuccessResult.GeneralOk({ content: generated_content.data, data });
    }
}