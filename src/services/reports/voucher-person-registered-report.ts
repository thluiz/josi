import { BaseReport } from "./base-report";
import { Result } from "../../helpers/result";

import { IPersonVoucherData } from '../people-service';
import { ConfigurationsService } from '../configurations-services';

export class VoucherPersonRegisterdReport extends BaseReport {
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

    static async send(voucher : IPersonVoucherData): Promise<Result> {
        const msg = {
            to: (await this.buildRecipients(voucher.branch_id)),
            from: 'contato@myvtmi.im',
            subject: `Cadastro pelo Voucher`,
            html: `
                    <p>Name: ${voucher.name}</p>
                    <p>Email: ${voucher.email || 'ND'}</p>
                    <p>CPF: ${voucher.cpf || 'ND'}</p>
                    <p>Phone: ${voucher.phone || 'ND'}</p>
                    <p>Links: ${voucher.socialLinks || 'ND'}</p>
                    <p>Voucher: ${voucher.voucher_id || 'ND'}</p>
                    <p>Invite: ${voucher.invite_key || 'ND'}</p>
                    <p>Schedule: ${voucher.branch_map_id || 'ND'}</p>
                `,
        };

        await this.send_email(msg);

        return Result.GeneralOk(msg);
    }
}