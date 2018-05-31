import { AzureTableService } from './../services/azure-tables-service';
import { JobsService } from "../services/jobs-service";

export function routes(app) {
    app.get("/api/hourly-jobs", async (req, res, next) => {                
        let result = await JobsService.execute_hourly_jobs();
        
        res.send(result);
    });    
}
