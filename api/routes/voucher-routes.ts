
import * as sql from 'mssql';
import { SecurityService } from '../../domain/services/security_services';
import * as auth from '../../src/middlewares/auth';
import { JobsService } from '../../src/services/jobs-service';
import { Result } from '../../src/helpers/result';

import sgMail = require('@sendgrid/mail');
import { LoggerService, ErrorOrigins } from '../../src/services/logger-service';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    let send_email = (msg): Promise<Result<any>> => {
        return new Promise((resolve, reject) => {
            sgMail.send(msg)
                .then(r2 => {
                    console.log(r2);
                    resolve(Result.GeneralOk(r2));
                })
                .catch(error => {
                    console.error(error.toString());

                    //Extract error msg
                    const { message, code, response } = error;
                    //Extract response msg
                    const { headers, body } = response;

                    console.log(code);
                    console.log(headers);
                    console.log(body);

                    reject(error);
                });
        });
    }

    app.post("/api/voucher",
    async (req, res, next) => {

        try {
            const msg = {
                to: 'th.luiz@gmail.com',
                from: 'contato@myvtmi.im',
                subject: `Cadastro pelo Voucher`,
                html: `
                    <p>Name: ${req.body.name}</p>
                    <p>Email: ${req.body.email || 'ND'}</p>
                    <p>CPF: ${req.body.cpf || 'ND'}</p>
                    <p>Phone: ${req.body.phone || 'ND'}</p>
                    <p>Links: ${req.body.socialLinks || 'ND'}</p>
                    <p>Voucher: ${req.body.voucher_id || 'ND'}</p>
                    <p>Invite: ${req.body.invite || 'ND'}</p>
                    <p>Schedule: ${req.body.schedule || 'ND'}</p>
                `,
            };

            try {
                send_email(msg);
            } catch (error) {
                LoggerService.error(ErrorOrigins.SendingEmail, error, 'Person Voucher registering');
            }

            const result = await new sql.Request(pool)
            .input('name', sql.VarChar(200), req.body.name)
            .input('email', sql.VarChar(100), req.body.email)
            .input('cpf', sql.VarChar(11), req.body.cpf)
            .input('phone', sql.VarChar(100), req.body.phone)
            .input('socialLinks', sql.VarChar(100), req.body.socialLinks)
            .input('branch_id', sql.Int, req.body.unit)
            .input('voucher_id', sql.Int, req.body.voucher_id || 1)
            .input('additionalAnswer', sql.VarChar(sql.MAX), req.body.additionalAnswer || '')
            .input('invite_key', sql.VarChar(60), req.body.invite)
            .input('branch_map_id', sql.Int, req.body.schedule || 0)
            .execute(`CreatePersonFromVoucher`);

        } catch (error) {
            console.log(error);
        }
        res.send({ sucess: true});
    });

    app.get("/api/voucher/invites", async(req, res, next) => {
        const result = await new sql.Request(pool)
        .execute(`GetInvitesForVoucher`);

        let response = result.recordset[0];

        res.send(response);
    });

    app.get("/api/voucher/data", async(req, res, next) => {
        const result = await new sql.Request(pool)
        .execute(`GetDataForVoucher`);

        let response = result.recordset[0];

        res.send(response);
    });

}
