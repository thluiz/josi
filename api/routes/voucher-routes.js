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
const jobs_services_1 = require("./../../domain/services/jobs_services");
const sql = require("mssql");
const security_services_1 = require("../../domain/services/security_services");
function configure_routes(app, connection_pool, appInsights, winston) {
    const pool = connection_pool;
    let jobs = new jobs_services_1.JobsService(connection_pool, appInsights);
    app.post("/api/voucher", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (appInsights) {
            appInsights.defaultClient.trackNodeHttpRequest({ request: req, response: res });
        }
        try {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(200), req.body.name)
                .input('email', sql.VarChar(100), req.body.email)
                .input('cpf', sql.VarChar(11), req.body.cpf)
                .input('phone', sql.VarChar(100), req.body.phone)
                .input('socialLinks', sql.VarChar(100), req.body.socialLinks)
                .input('branch_id', sql.Int, req.body.unit)
                .input('voucher_id', sql.Int, req.body.voucher_id || 1)
                .input('additionalAnswer', sql.VarChar(sql.MAX), req.body.additionalAnswer || '')
                .input('branch_map_id', sql.Int, req.body.schedule)
                .execute(`CreatePersonFromVoucher`);
        }
        catch (error) {
            if (appInsights) {
                appInsights.trackException(error, "voucher");
            }
            console.log(error);
        }
        res.send({ sucess: true });
    }));
    app.get("/api/voucher", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetDataForVoucher`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.get("/api/parameters/vouchers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from voucher order by title for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.post("/api/parameters/vouchers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const voucher = req.body.voucher;
        let result = null;
        try {
            const start = Date.now();
            winston.info("Saving Voucher", voucher);
            if (voucher.id > 0) {
                result = yield new sql.Request(pool)
                    .input('id', sql.Int, voucher.id)
                    .input('title', sql.VarChar(100), voucher.title)
                    .input('url', sql.VarChar(100), voucher.url)
                    .input('initials', sql.VarChar(3), voucher.initials)
                    .input('additional_question', sql.VarChar(200), voucher.additional_question)
                    .input('header_text', sql.VarChar(sql.MAX), voucher.header_text)
                    .input('final_text', sql.VarChar(sql.MAX), voucher.final_text)
                    .input('confirm_button_text', sql.VarChar(35), voucher.confirm_button_text)
                    .input('header_title', sql.VarChar(40), voucher.header_title)
                    .query(`update voucher set
                            title = @title,
                            [url] = @url,
                            header_text = @header_text,
                            final_text = @final_text,
                            additional_question = @additional_question,
                            initials = @initials,
                            confirm_button_text = @confirm_button_text,
                            header_title = @header_title
                        where id = @id`);
            }
            else {
                result = yield new sql.Request(pool)
                    .input('title', sql.VarChar(100), voucher.title)
                    .input('url', sql.VarChar(100), voucher.url)
                    .input('initials', sql.VarChar(3), voucher.initials)
                    .input('additional_question', sql.VarChar(200), voucher.additional_question)
                    .input('header_text', sql.VarChar(sql.MAX), voucher.header_text)
                    .input('final_text', sql.VarChar(sql.MAX), voucher.final_text)
                    .input('confirm_button_text', sql.VarChar(35), voucher.confirm_button_text)
                    .input('header_title', sql.VarChar(40), voucher.header_title)
                    .query(`insert into voucher (title, [url], header_text, final_text, 
                        additional_question, initials, confirm_button_text, header_title)
                            values (@title, @url, @header_text, @final_text, @additional_question, 
                                    @initials, @confirm_button_text, @header_title)`);
            }
            jobs.update_voucher_site();
            res.send({ sucess: true });
        }
        catch (error) {
            winston.error("Error saving Voucher", error);
            res.status(500).json({ url: process.env.VOUCHER_SITE_UPDATE_URL, res, error, voucher, result });
        }
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=voucher-routes.js.map