import { OwnershipClosingReport } from '../services/reports/ownership-closing-report';
import { JobsService } from "../services/jobs-service";
import { IncidentsRepository } from '../repositories/incidents-repository';

export function routes(app) {
    app.get("/api/hourly-jobs", async (req, res, next) => {
        let result = await JobsService.execute_hourly_jobs();

        res.send(result);
    });

    app.get("/api/cleanup-sessions", async (req, res, next) => {
        let result = await JobsService.cleanup_sessions();

        res.send(result);
    });

    app.get("/api/ownership_report", async (req, res, next) => {
        var IR = await IncidentsRepository.getRepository();
        let incident = await IR.findOne(69836);

        let result = await OwnershipClosingReport.send(incident);

        res.send(result.success ? result.data.content : result);
    });
}
