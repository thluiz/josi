import * as auth from '../../middlewares/auth';
import { PeopleService } from '../../services/people-service';

import { DatabaseManager } from '../../services/managers/database-manager';
import { Result, SuccessResult, ErrorResult } from '../../helpers/result';
import { ErrorCode } from '../../helpers/errors-codes';

import { JobsService } from '../../services/jobs-service';
import { ParametersService } from '../../services/parameters-service';

import { Branch } from '../../entity/Branch';
import { Voucher } from '../../entity/Voucher';
import { IPersonVoucherData } from '../../services/people-service';
import { VoucherPersonRegisterdReport } from '../../services/reports/voucher-person-registered-report';
import { LoggerService, LogOrigins } from '../../services/logger-service';

const PS = new PeopleService();
const DBM = new DatabaseManager();

export function routes(app) {
    app.get("/api/vouchers/:id?",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
        const VR = await DBM.getRepository<Voucher>(Voucher);

        let vouchers = req.params.id > 0 ?
                        await VR.find({ where: { id : req.params.id }, relations: ['branches', 'voucher_type']})
                        : await VR.find({ order: { "active": "DESC" }, relations: ['voucher_type'] });

        res.send(SuccessResult.GeneralOk(vouchers));
    });

    app.post("/api/parameters/voucher_branch/add",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            const BR = await DBM.getRepository<Branch>(Branch);
            const VR = await DBM.getRepository<Voucher>(Voucher);

            let branch = await BR.findOne(req.body.branch.id);
            let voucher = await VR.findOne(req.body.voucher.id);

            res.send(await ParametersService.create_branch_voucher(branch, voucher));
        }
    );

    app.post("/api/parameters/voucher_branch/remove",
        auth.ensureLoggedIn(),
        async (req, res, _next) => {
            const BR = await DBM.getRepository<Branch>(Branch);
            const VR = await DBM.getRepository<Voucher>(Voucher);

            let branch = await BR.findOne(req.body.branch.id);
            let voucher = await VR.findOne(req.body.voucher.id);

            res.send(await ParametersService.remove_branch_voucher(branch, voucher));
        }
    );

    app.post("/api/parameters/vouchers",
    auth.ensureLoggedIn(),
    async (req, res) => {
        const voucher_data = req.body.voucher;

        let result = await ParametersService.save_voucher(voucher_data);

        if(!result.success) {
            res.send(result);
            return;
        }

        try {
            let result_voucher = await JobsService.update_voucher_site();

            if(!result_voucher.success) {
                let e = result_voucher as ErrorResult;
                e.inner_error = e;
                e.error_code == ErrorCode.ParcialExecution;
            }

            res.send(result_voucher);
        } catch (error) {
            res.send(ErrorResult.Fail(ErrorCode.ParcialExecution, error));
        }
    });

    /**********************************************
     * EXTERNAL ROUTES
     **********************************************/

    app.post("/api/voucher",
    async (req, res, _next) => {
        try {
            LoggerService.info(LogOrigins.ExternalResource, req.body);

            let data : IPersonVoucherData = {
                name: req.body.name,
                email: req.body.email,
                cpf: req.body.cpf,
                phone: req.body.phone,
                socialLinks: req.body.socialLinks,
                branch_id: isNaN(req.body.unit) ? 1 : parseInt(req.body.unit),
                branch_map_id: req.body.schedule || 0,
                voucher_id: req.body.voucher_id || 1,
                additionalAnswer: req.body.additionalAnswer || '',
                invite_key: req.body.invite
            };

            await VoucherPersonRegisterdReport.send(data);

            await PS.create_person_from_voucher(data);
        } catch (error) {
            LoggerService.error(ErrorCode.ExternalResource, error);
        }
        res.send({ sucess: true});
    });

    app.get("/api/voucher/invites", async(_req, res, _next) => {
        const result = await DBM.ExecuteJsonSP("GetInvitesForVoucher");
        res.send(result.data);
    });

    app.get("/api/voucher/data", async(_req, res, _next) => {
        const result = await DBM.ExecuteJsonSP("GetDataForVoucher");
        res.send(result.data);
    });
}
