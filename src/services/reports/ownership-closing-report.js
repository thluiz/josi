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
const base_report_1 = require("./base-report");
const result_1 = require("../../helpers/result");
const incidents_repository_1 = require("../../repositories/incidents-repository");
const configurations_services_1 = require("../configurations-services");
let IR = incidents_repository_1.IncidentsRepository;
class OwnershipClosingReport extends base_report_1.BaseReport {
    static buildRecipients(branch_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = [configurations_services_1.ConfigurationsService.EMAIL_DEV];
            const branch_email = yield this.getBranchEmail(branch_id);
            if (branch_email && branch_email.length > 0) {
                result.push(branch_email);
            }
            const im_email = yield this.getIMEmail();
            if (im_email && im_email.length > 0) {
                result.push(im_email);
            }
            return result;
        });
    }
    static send(ownership_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ow_data_request = yield IR.getOwnershipData(ownership_id);
            let data = ow_data_request.data;
            const generated_content = yield this.render_template(this.template_name, data);
            if (!generated_content.success) {
                return generated_content;
            }
            const msg = {
                to: (yield this.buildRecipients(data.branch_id)),
                from: 'contato@myvtmi.im',
                subject: `Fechamento de titularidade - ${data.branch_name} `,
                html: generated_content.data,
            };
            yield this.send_email(msg);
            return result_1.Result.GeneralOk({ content: generated_content.data, data });
        });
    }
}
OwnershipClosingReport.template_name = "ownership_closing_report";
exports.OwnershipClosingReport = OwnershipClosingReport;
//# sourceMappingURL=ownership-closing-report.js.map