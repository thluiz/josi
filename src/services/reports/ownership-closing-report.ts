import { Result, SuccessResult } from "../../helpers/result";
import { IMessage } from "../managers/email-manager";
import { BaseReport } from "./base-report";

import { Incident } from "../../entity/Incident";
import { IncidentsRepository } from "../../repositories/incidents-repository";
import { ConfigurationsService } from "../configurations-services";

export class OwnershipClosingReport extends BaseReport {
    private IR = new IncidentsRepository();

    constructor() {
        super();
        this.templateName = "ownership_closing_report";
    }

    async send(ownership: Incident): Promise<Result> {
        const owDataRequest = await this.IR.getOwnershipData(ownership.id);
        const data = owDataRequest.data;

        const generatedContent = await this.render_template(this.templateName, data);
        if (!generatedContent.success) {
            return generatedContent;
        }

        const msg: IMessage = {
            to: (await this.buildRecipients(data.branch_id)),
            from: "contato@myvtmi.im",
            subject: `Fechamento de titularidade - ${data.branch_name} `,
            html: generatedContent.data,
        };

        await this.send_email(msg);

        return SuccessResult.GeneralOk({ content: generatedContent.data, data });
    }

    private async buildRecipients(branchId): Promise<string[]> {
        const result = [ ConfigurationsService.EMAIL_DEV ];

        const branchEmail = await this.getBranchEmail(branchId);
        if (branchEmail && branchEmail.length > 0) {
            result.push(branchEmail);
        }

        const imEmail = await this.getIMEmail();
        if (imEmail && imEmail.length > 0) {
            result.push(imEmail);
        }

        return result;
    }
}
