"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const azure = require("azure-storage");
class AzureTableService {
    static createTableService() {
        if (!this.config) {
            this.config = this.loadConfig();
        }
        return azure.createTableService(this.config.name, this.config.accessKey);
    }
    static createTableIfNotExists(tableService, table, callback) {
        tableService.createTableIfNotExists(table, callback);
    }
    static buildEntity(id, data = {}, partition = 'principal') {
        const entGen = azure.TableUtilities.entityGenerator;
        const date = new Date();
        return {
            PartitionKey: entGen.String(partition),
            RowKey: entGen.String(id),
            CreatedOn: Math.floor(Date.now() / 1000),
            Content: JSON.stringify(data)
        };
    }
    static insertOrMergeEntity(tableService, table, entity, callback) {
        tableService.insertOrReplaceEntity(table, entity, callback);
    }
    static retriveEntity(tableService, table, id, callback, partition = 'principal') {
        tableService.retrieveEntity(table, partition, id, (err, result, response) => {
            let data = this.treatDataRetrieved(result);
            callback(err, data, response);
        });
    }
    static deleteEntity(tableService, table, id, callback) {
        tableService.deleteEntity(table, this.buildEntity(id), function (error, response) {
            callback(error, response);
        });
    }
    static loadConfig() {
        return {
            name: process.env.AZURE_STORAGE_NAME,
            accessKey: process.env.AZURE_STORAGE_ACCESS_KEY
        };
    }
    static treatDataRetrieved(data) {
        let new_data = {};
        if (!data)
            return null;
        return JSON.parse(data.Content._);
    }
}
exports.AzureTableService = AzureTableService;
//# sourceMappingURL=azure-tables-service.js.map