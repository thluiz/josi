import { JobsService } from "../services/jobs-service";

export function routes(app) {
    app.get("/api/hourly-jobs", async (req, res, next) => {                
        res.send(await JobsService.execute_hourly_jobs());
    });
}