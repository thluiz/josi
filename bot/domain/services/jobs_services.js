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
const sumary_services_1 = require("./sumary_services");
const sql = require('mssql');
class JobsService {
    constructor(sql_pool) {
        this.sql_pool = sql_pool;
        this.sumary_service = new sumary_services_1.SumaryService(sql_pool);
    }
    hourly_jobs() {
        return __awaiter(this, void 0, void 0, function* () {
            let members_sumary_result = yield this.sumary_service.consolidate_members_sumary();
        });
    }
}
exports.JobsService = JobsService;
//# sourceMappingURL=jobs_services.js.map