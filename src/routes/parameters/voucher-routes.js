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
const people_service_1 = require("./../../services/people-service");
const auth = require("../../../src/middlewares/auth");
const database_facility_1 = require("../../facilities/database-facility");
const result_1 = require("../../helpers/result");
const errors_codes_1 = require("../../helpers/errors-codes");
const jobs_service_1 = require("../../services/jobs-service");
const parameters_service_1 = require("../../services/parameters-service");
const Branch_1 = require("../../entity/Branch");
const Voucher_1 = require("./../../entity/Voucher");
const voucher_person_registered_report_1 = require("../../services/reports/voucher-person-registered-report");
function routes(app) {
    app.get("/api/vouchers/:id?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const VR = yield database_facility_1.DatabaseFacility.getRepository(Voucher_1.Voucher);
        let vouchers = req.params.id > 0 ?
            yield VR.find({ where: { id: req.params.id }, relations: ['branches', 'voucher_type'] })
            : yield VR.find({ order: { "active": "DESC" }, relations: ['voucher_type'] });
        res.send(result_1.Result.GeneralOk(vouchers));
    }));
    app.post("/api/parameters/voucher_branch/add", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const BR = yield database_facility_1.DatabaseFacility.getRepository(Branch_1.Branch);
        const VR = yield database_facility_1.DatabaseFacility.getRepository(Voucher_1.Voucher);
        let branch = yield BR.findOne(req.body.branch.id);
        let voucher = yield VR.findOne(req.body.voucher.id);
        res.send(yield parameters_service_1.ParametersService.create_branch_voucher(branch, voucher));
    }));
    app.post("/api/parameters/voucher_branch/remove", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const BR = yield database_facility_1.DatabaseFacility.getRepository(Branch_1.Branch);
        const VR = yield database_facility_1.DatabaseFacility.getRepository(Voucher_1.Voucher);
        let branch = yield BR.findOne(req.body.branch.id);
        let voucher = yield VR.findOne(req.body.voucher.id);
        res.send(yield parameters_service_1.ParametersService.remove_branch_voucher(branch, voucher));
    }));
    app.post("/api/parameters/vouchers", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const voucher_data = req.body.voucher;
        let result = yield parameters_service_1.ParametersService.save_voucher(voucher_data);
        if (!result.success) {
            res.send(result);
            return;
        }
        try {
            let result_voucher = yield jobs_service_1.JobsService.update_voucher_site();
            if (!result_voucher.success) {
                result_voucher.error_code == errors_codes_1.ErrorCode.ParcialExecution;
            }
            res.send(result_voucher);
        }
        catch (error) {
            res.send(result_1.Result.Fail(errors_codes_1.ErrorCode.ParcialExecution, error));
        }
    }));
    /**********************************************
     * EXTERNAL ROUTES
     **********************************************/
    app.post("/api/voucher", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let data = {
                name: req.body.name,
                email: req.body.email,
                cpf: req.body.cpf,
                phone: req.body.phone,
                socialLinks: req.body.socialLinks,
                branch_id: req.body.unit,
                branch_map_id: req.body.schedule || 0,
                voucher_id: req.body.voucher_id || 1,
                additionalAnswer: req.body.additionalAnswer || '',
                invite_key: req.body.invite
            };
            yield voucher_person_registered_report_1.VoucherPersonRegisterdReport.send(data);
            yield people_service_1.PeopleService.create_person_from_voucher(data);
        }
        catch (error) {
            console.log(error);
        }
        res.send({ sucess: true });
    }));
    app.get("/api/voucher/invites", (_req, res, _next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetInvitesForVoucher");
        res.send(result.data);
    }));
    app.get("/api/voucher/data", (_req, res, _next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetDataForVoucher");
        res.send(result.data);
    }));
}
exports.routes = routes;
//# sourceMappingURL=voucher-routes.js.map