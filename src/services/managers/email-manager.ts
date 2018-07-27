import { isArray } from 'util';
import sgMail = require('@sendgrid/mail');
import { LoggerService } from '../../../src/services/logger-service';
import { Result } from '../../helpers/result';
import { ConfigurationsService } from '../configurations-services';
import { ErrorCode } from '../../helpers/errors-codes';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export interface IMessage {
    to : string | string[],
    from : string,
    subject: string,
    html: string
}

export class EmailManager {
    static send_email(msg : IMessage): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            if(process.env.SEND_EMAIL_AS_PRODUCTION !== "true") {
                msg.subject += "[DEST:" +
                                    (isArray(msg.to) ?
                                        (msg.to as string[]).join(", ") : msg.to) +
                                "]";

                msg.to = ConfigurationsService.EMAIL_DEV;
            }

            sgMail.send(msg)
                .then(r2 => {
                    resolve(Result.GeneralOk(r2));
                })
                .catch(error => {
                    //Extract error msg
                    //const { message, code, response } = error;
                    //Extract response msg
                    //const { headers, body } = response;
                    LoggerService.error(ErrorCode.SendingEmail, error,
                        `ERROR EMAIL :: ${msg.subject || "NO SUBJECT" }`);
                    reject(error);
                });
        });
    }
}