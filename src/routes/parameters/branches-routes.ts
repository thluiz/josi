import * as auth from '../../middlewares/auth';
import { DatabaseManager } from '../../services/managers/database-manager';
import { ParametersService } from '../../services/parameters-service';
import { JobsService } from '../../services/jobs-service';
import { Result } from '../../helpers/result';
import { ErrorCode } from '../../helpers/errors-codes';

let DBM = new DatabaseManager();

export function routes(app) {
    app.get("/api/branches/:id?",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
        try {
            const result = !req.params.id ?
                await DBM.ExecuteJsonSP(`GetBranches`)
                : await DBM.ExecuteJsonSQL(
                        `select * from vwBranch where id = @0 for json path`,
                        req.params.id);

            res.send(result.data);
        } catch (error) {
            res.status(500).json({ error });
        }
    });

    app.get("/api/all_branches/:id?",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
        try {
            const result = !req.params.id ?
                await DBM.ExecuteJsonSP(`GetBranches`, { 'active': null })
                : await DBM.ExecuteJsonSQL(
                        `select * from vwBranch where id = @0 for json path`,
                        req.params.id);

            res.send(result.data);
        } catch (error) {
            res.status(500).json({ error });
        }
    });

    app.post("/api/branches_new",
    auth.ensureLoggedIn(),
    async (req, res, next) => {
        let result = await ParametersService.create_branch(req.body.branch);

        if(!result.success) {
            res.send(result);
            return;
        }

        let update_voucher = await JobsService.update_voucher_site();

        if(!update_voucher.success) {
            res.send(
                Result.Fail(ErrorCode.ParcialExecution,
                    update_voucher.error, null, result.data
                )
            );
            return;
        }

        res.send(result);
    });
}
