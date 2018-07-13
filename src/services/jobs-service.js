"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const people_service_1 = require("./people-service");
const cards_service_1 = require("./cards-service");
const database_facility_1 = require("../facilities/database-facility");
const result_1 = require("../helpers/result");
const axios_1 = require("axios");
const errors_codes_1 = require("../helpers/errors-codes");
const trylog_decorator_1 = require("../decorators/trylog-decorator");
const logger_service_1 = require("./logger-service");
const incidents_repository_1 = require("../repositories/incidents-repository");
const uuid = require("uuid/v4");
const await_to_js_1 = require("await-to-js");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const path = require("path");
const Ejs = require("ejs");
let IR = incidents_repository_1.IncidentsRepository;
exports.HOURLY_JOB_EXECUTION = "HOURLY_JOB_EXECUTION";
class JobsService {
    static execute_hourly_jobs() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Start running jobs...');
            let start_time = new Date().getTime();
            let key = uuid();
            logger_service_1.LoggerService.benchmark(key, "Starting Running Jobs", { start_time });
            let results = [];
            results.push(yield people_service_1.PeopleService.generate_birthdate_incidents());
            results.push(yield people_service_1.PeopleService.cancel_expired_people_scheduling());
            results.push(yield people_service_1.PeopleService.check_people_status());
            results.push(yield people_service_1.PeopleService.check_people_comunication_status());
            results.push(yield people_service_1.PeopleService.check_people_financial_status());
            results.push(yield people_service_1.PeopleService.check_people_scheduling_status());
            results.push(yield cards_service_1.CardsService.correct_card_out_of_parent_step());
            results.push(yield cards_service_1.CardsService.check_cards_has_overdue_cards());
            results.push(yield this.consolidate_members_sumary());
            results.push(yield this.consolidate_activity_sumary());
            results.push(yield this.cleanup_sessions());
            let end_time = new Date().getTime();
            let err = results.find(r => !r.success);
            logger_service_1.LoggerService.benchmark(key, exports.HOURLY_JOB_EXECUTION, {
                start_time,
                success: err == null,
                end_time,
                duration: (end_time - start_time) / 1000,
                results
            });
            console.log("Finished running jobs!");
            if (err)
                return err;
            return result_1.Result.GeneralOk();
        });
    }
    static cleanup_sessions() {
        return __awaiter(this, void 0, void 0, function* () {
            const AzureSessionStore = require('../middlewares/azure-session-storage');
            const storage = new AzureSessionStore();
            try {
                let results = yield storage.cleanup();
                return results;
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static update_voucher_site() {
        return __awaiter(this, void 0, void 0, function* () {
            let [err_voucher, result_voucher] = yield await_to_js_1.default(axios_1.default.get(process.env.VOUCHER_SITE_UPDATE_URL));
            if (err_voucher || result_voucher.status != 200)
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ExternalRequestError, err_voucher || new Error(result_voucher.statusText), null);
            let [err_invites, result_invites] = yield await_to_js_1.default(axios_1.default.get(process.env.VOUCHER_SITE_UPDATE_INVITES_URL));
            if (err_invites || result_invites.status != 200)
                return result_1.Result.Fail(errors_codes_1.ErrorCode.ExternalRequestError, err_invites || new Error(result_invites.statusText), null);
            return result_1.Result.GeneralOk();
        });
    }
    static send_ownership_closing_report(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //const IR = await DatabaseFacility.getRepository<Incident>(Incident);
            const light_incident = yield (yield IR.getRepository()).findOne({ id }, { relations: ["branch"] });
            var templatePath = path.join(__dirname, "../template/ownership_closing_report.html");
            let ow_data_request = yield IR.getOwnershipData(id);
            let data = ow_data_request.data;
            let content = "";
            try {
                const generated_content = yield this.render_template(templatePath, data);
                content = generated_content.data;
            }
            catch (error) {
                content = `Error rendering content ${error.message}`;
            }
            const msg = {
                to: 'th.luiz@gmail.com',
                from: 'contato@myvtmi.im',
                subject: `Fechamento de titularidade - ${data.branch_name} `,
                html: content,
            };
            try {
                console.log(msg.to);
                yield this.send_email(msg);
            }
            catch (error) {
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
            return result_1.Result.Ok("GENERIC_ACTION", { content, data });
        });
    }
    static render_template(template_path, data) {
        return new Promise((resolve, reject) => {
            Ejs.renderFile(template_path, { data: data }, (err, content) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result_1.Result.GeneralOk(content));
            });
        });
    }
    static send_email(msg) {
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
    }
    static consolidate_members_sumary() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("ConsolidateMembersSumary");
        });
    }
    static consolidate_activity_sumary() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_facility_1.DatabaseFacility.ExecuteSPNoResults("ConsolidateActivitySumary");
        });
    }
}
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService, "execute_hourly_jobs", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService, "cleanup_sessions", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService, "update_voucher_site", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], JobsService, "send_ownership_closing_report", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService, "consolidate_members_sumary", null);
__decorate([
    trylog_decorator_1.trylog(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JobsService, "consolidate_activity_sumary", null);
exports.JobsService = JobsService;
//# sourceMappingURL=jobs-service.js.map