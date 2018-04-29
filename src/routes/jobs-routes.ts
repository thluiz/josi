import { AzureTableService } from './../services/azure-tables-service';
import { JobsService } from "../services/jobs-service";

export function routes(app) {
    app.get("/api/hourly-jobs", async (req, res, next) => {                
        res.send(await JobsService.execute_hourly_jobs());
    });

    app.get("/test-azure/create", async (req, res, next) => {                
        var tableSvc = AzureTableService.createTableService();
        AzureTableService.createTableIfNotExists(tableSvc, 'Test', (error, result, Response) => {
            var entity = AzureTableService.createEntity("teste1", {
                property1: 'a',
                property2: 'b',
                property3: 'c',
            });

            AzureTableService.insertOrMergeEntity(tableSvc, 'Test', entity, (err, result) => {
                console.log(err);
                console.log(result);
                console.log(entity);
                res.send(true);
            });
        });        
    });

    app.get("/test-azure/retrieve", async (req, res, next) => {                
        var tableSvc = AzureTableService.createTableService();
        AzureTableService.createTableIfNotExists(tableSvc, 'Test', (error, result, Response) => {
            AzureTableService.retriveEntity(tableSvc, 'Test', "teste1", (err, result) => {
                console.log(err);
                console.log(result);
                res.send(result);
            });
        });        
    });

    app.get("/test-azure/update", async (req, res, next) => {                
        var tableSvc = AzureTableService.createTableService();
        AzureTableService.createTableIfNotExists(tableSvc, 'Test', (error, result, Response) => {
            var entity = AzureTableService.createEntity("teste1", {
                property1: 'd',
                property2: (new Date()).getMinutes(),
                property3: 'e',
            });

            AzureTableService.insertOrMergeEntity(tableSvc, 'Test', entity, (err, result) => {
                console.log(err);
                console.log(result);
                console.log(entity);
                res.send(true);
            });
        });        
    });
}
