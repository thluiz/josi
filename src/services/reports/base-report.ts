import { Branch } from '../../entity/Branch';
import { DatabaseManager } from '../managers/database-manager';
import { LoggerService } from '../logger-service';
import { EmailManager, IMessage } from '../managers/email-manager';
import path = require('path');
import Ejs = require('ejs');
import { Result } from '../../helpers/result';
import { ErrorCode } from '../../helpers/errors-codes';
import { ConfigurationsService, Configurations } from '../configurations-services';

const DBM = new DatabaseManager();

export class BaseReport {
    protected static async getIMEmail() : Promise<string> {
        return ConfigurationsService.getConfiguration(Configurations.EMAIL_IM);
    }

    protected static async getBranchEmail(branch_id : number) : Promise<string> {
        let BR = await DBM.getRepository<Branch>(Branch);
        let branch = await BR.findOne(branch_id);

        return branch.contact_email;
    }

    protected static render_template(name, data): Promise<Result<any>> {
        return new Promise((resolve, _reject) => {
            try {
                var template_path = path.join(__dirname, `templates/${name}.html`);

                Ejs.renderFile(template_path, { data: data }, (err, content) => {
                    if (err) {
                        LoggerService.error(ErrorCode.SendingEmail, err);

                        resolve(Result.Fail(ErrorCode.GenericError, err, "Error sending report email"));
                        return;
                    }

                    resolve(Result.GeneralOk(content));
                });
            } catch (error) {
                LoggerService.error(ErrorCode.SendingEmail, error);
                resolve(Result.Fail(ErrorCode.GenericError, error, "Error sending report email"));
            }
        });
    }

    protected static send_email(msg : IMessage): Promise<Result<any>> {
        return EmailManager.send_email(msg);
    }
}
