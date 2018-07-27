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
const Branch_1 = require("./../../entity/Branch");
const database_facility_1 = require("./../../facilities/database-facility");
const logger_service_1 = require("./../logger-service");
const email_manager_1 = require("./../managers/email-manager");
const path = require("path");
const Ejs = require("ejs");
const result_1 = require("../../helpers/result");
const errors_codes_1 = require("../../helpers/errors-codes");
const configurations_services_1 = require("../configurations-services");
class BaseReport {
    static getIMEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            return configurations_services_1.ConfigurationsService.getConfiguration(configurations_services_1.Configurations.EMAIL_IM);
        });
    }
    static getBranchEmail(branch_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let BR = yield database_facility_1.DatabaseFacility.getRepository(Branch_1.Branch);
            let branch = yield BR.findOne(branch_id);
            return branch.contact_email;
        });
    }
    static render_template(name, data) {
        return new Promise((resolve, _reject) => {
            try {
                var template_path = path.join(__dirname, `templates/${name}.html`);
                Ejs.renderFile(template_path, { data: data }, (err, content) => {
                    if (err) {
                        logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.SendingEmail, err);
                        resolve(result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, err, "Error sending report email"));
                        return;
                    }
                    resolve(result_1.Result.GeneralOk(content));
                });
            }
            catch (error) {
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.SendingEmail, error);
                resolve(result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error, "Error sending report email"));
            }
        });
    }
    static send_email(msg) {
        return email_manager_1.EmailManager.send_email(msg);
    }
}
exports.BaseReport = BaseReport;
//# sourceMappingURL=base-report.js.map