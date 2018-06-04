import * as auth from '../../../src/middlewares/auth';

import { DatabaseFacility } from '../../facilities/database-facility';
import { Result } from '../../helpers/result';
import { ErrorCode } from '../../helpers/errors-codes';

import { JobsService } from '../../services/jobs-service';
import { ParametersService } from '../../services/parameters-service';

import { Branch } from '../../entity/Branch';
import { Voucher } from './../../entity/Voucher';


export function routes(app) {    
    app.get("/api/vouchers/:id?", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {                                
        const VR = await DatabaseFacility.getRepository<Voucher>(Voucher);

        let vouchers = req.params.id > 0 ? 
                        await VR.find({ where: { id : req.params.id }, relations: ['branches']})
                        : await VR.find({ order: { "active": "DESC" } });

        res.send(Result.GeneralOk(vouchers));                                          
    });

    app.post("/api/parametes/voucher_branch/add",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            const BR = await DatabaseFacility.getRepository<Branch>(Branch);
            const VR = await DatabaseFacility.getRepository<Voucher>(Voucher);
            
            let branch = await BR.findOne(req.body.branch.id);
            let voucher = await VR.findOne(req.body.voucher.id);

            res.send(await ParametersService.create_branch_voucher(branch, voucher));
        }
    );

    app.post("/api/parametes/voucher_branch/remove",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            const BR = await DatabaseFacility.getRepository<Branch>(Branch);
            const VR = await DatabaseFacility.getRepository<Voucher>(Voucher);
            
            let branch = await BR.findOne(req.body.branch.id);
            let voucher = await VR.findOne(req.body.voucher.id);

            res.send(await ParametersService.remove_branch_voucher(branch, voucher));
        }
    );

    app.post("/api/parameters/vouchers", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {      
        const voucher_data = req.body.voucher;
        let result = await ParametersService.save_voucher(voucher_data);
        
        if(!result.success) {
            res.send(result);
            return;
        }                     

        let result_voucher = await JobsService.update_voucher_site();
        
        if(!result_voucher.success) {
            result_voucher.error_code == ErrorCode.ParcialExecution;
        }

        res.send(result_voucher);
    });
}

