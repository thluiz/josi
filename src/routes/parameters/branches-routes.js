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
const auth = require("../../middlewares/auth");
const database_manager_1 = require("../../services/managers/database-manager");
const parameters_service_1 = require("../../services/parameters-service");
const jobs_service_1 = require("../../services/jobs-service");
const result_1 = require("../../helpers/result");
const errors_codes_1 = require("../../helpers/errors-codes");
let DBM = new database_manager_1.DatabaseManager();
function routes(app) {
    app.get("/api/branches/:id?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = !req.params.id ?
                yield DBM.ExecuteJsonSP(`GetBranches`)
                : yield DBM.ExecuteJsonSQL(`select * from vwBranch where id = @0 for json path`, req.params.id);
            res.send(result.data);
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
    app.get("/api/all_branches/:id?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = !req.params.id ?
                yield DBM.ExecuteJsonSP(`GetBranches`, { 'active': null })
                : yield DBM.ExecuteJsonSQL(`select * from vwBranch where id = @0 for json path`, req.params.id);
            res.send(result.data);
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
    app.post("/api/branches_new", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let result = yield parameters_service_1.ParametersService.create_branch(req.body.branch);
        if (!result.success) {
            res.send(result);
            return;
        }
        let update_voucher = yield jobs_service_1.JobsService.update_voucher_site();
        if (!update_voucher.success) {
            res.send(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.ParcialExecution, update_voucher.data, update_voucher));
            return;
        }
        res.send(result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=branches-routes.js.map