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
const ownership_closing_report_1 = require("../services/reports/ownership-closing-report");
const jobs_service_1 = require("../services/jobs-service");
const incidents_repository_1 = require("../repositories/incidents-repository");
function routes(app) {
    app.get("/api/hourly-jobs", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield jobs_service_1.JobsService.execute_hourly_jobs();
        res.send(result);
    }));
    app.get("/api/cleanup-sessions", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield jobs_service_1.JobsService.cleanup_sessions();
        res.send(result);
    }));
    app.get("/api/ownership_report", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var IR = yield incidents_repository_1.IncidentsRepository.getRepository();
        let incident = yield IR.findOne(69836);
        let result = yield ownership_closing_report_1.OwnershipClosingReport.send(incident);
        res.send(result.success ? result.data.content : result);
    }));
}
exports.routes = routes;
//# sourceMappingURL=jobs-routes.js.map