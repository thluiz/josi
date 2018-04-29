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
const azure_tables_service_1 = require("./../services/azure-tables-service");
const jobs_service_1 = require("../services/jobs-service");
function routes(app) {
    app.get("/api/hourly-jobs", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        res.send(yield jobs_service_1.JobsService.execute_hourly_jobs());
    }));
    app.get("/test-azure/create", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var tableSvc = azure_tables_service_1.AzureTableService.createTableService();
        azure_tables_service_1.AzureTableService.createTableIfNotExists(tableSvc, 'Test', (error, result, Response) => {
            var entity = azure_tables_service_1.AzureTableService.createEntity("teste1", {
                property1: 'a',
                property2: 'b',
                property3: 'c',
            });
            azure_tables_service_1.AzureTableService.insertOrMergeEntity(tableSvc, 'Test', entity, (err, result) => {
                console.log(err);
                console.log(result);
                console.log(entity);
                res.send(true);
            });
        });
    }));
    app.get("/test-azure/retrieve", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var tableSvc = azure_tables_service_1.AzureTableService.createTableService();
        azure_tables_service_1.AzureTableService.createTableIfNotExists(tableSvc, 'Test', (error, result, Response) => {
            azure_tables_service_1.AzureTableService.retriveEntity(tableSvc, 'Test', "teste1", (err, result) => {
                console.log(err);
                console.log(result);
                res.send(result);
            });
        });
    }));
    app.get("/test-azure/update", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var tableSvc = azure_tables_service_1.AzureTableService.createTableService();
        azure_tables_service_1.AzureTableService.createTableIfNotExists(tableSvc, 'Test', (error, result, Response) => {
            var entity = azure_tables_service_1.AzureTableService.createEntity("teste1", {
                property1: 'd',
                property2: (new Date()).getMinutes(),
                property3: 'e',
            });
            azure_tables_service_1.AzureTableService.insertOrMergeEntity(tableSvc, 'Test', entity, (err, result) => {
                console.log(err);
                console.log(result);
                console.log(entity);
                res.send(true);
            });
        });
    }));
}
exports.routes = routes;
//# sourceMappingURL=jobs-routes.js.map