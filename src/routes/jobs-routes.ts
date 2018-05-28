import { AzureTableService } from './../services/azure-tables-service';
import { JobsService } from "../services/jobs-service";

export function routes(app) {
    app.get("/api/hourly-jobs", async (req, res, next) => {                
        res.send(await JobsService.execute_hourly_jobs());
    });

    app.get("/api/current_time", async (req, res, next) => {                
        const dt = new Date();

        res.send({ 
            milliseconds:  dt.getTime(),
            date: dt
        });
    });
}
