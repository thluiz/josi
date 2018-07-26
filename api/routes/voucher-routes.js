"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("mssql");
const result_1 = require("../../src/helpers/result");
const sgMail = require("@sendgrid/mail");
const logger_service_1 = require("../../src/services/logger-service");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    let send_email = (msg) => {
        return new Promise((resolve, reject) => {
            sgMail.send(msg)
                .then(r2 => {
                console.log(r2);
                resolve(result_1.Result.GeneralOk(r2));
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
    };
    app.post("/api/voucher", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (error) {
                logger_service_1.LoggerService.error(logger_service_1.ErrorOrigins.SendingEmail, error, 'Person Voucher registering');
            }
            const result = yield new sql.Request(pool)
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
        }
        catch (error) {
            console.log(error);
        }
        res.send({ sucess: true });
    }));
    app.get("/api/voucher/invites", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetInvitesForVoucher`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.get("/api/voucher/data", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetDataForVoucher`);
        let response = result.recordset[0];
        res.send(response);
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=voucher-routes.js.map