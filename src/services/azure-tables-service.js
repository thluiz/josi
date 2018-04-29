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
    static createEntity(id, data = {}) {
        const entGen = azure.TableUtilities.entityGenerator;
        return {
            PartitionKey: entGen.String(id),
            RowKey: entGen.String(this.rowKey),
            Content: JSON.stringify(data)
        };
    }
    static insertOrMergeEntity(tableService, table, entity, callback) {
        tableService.insertOrReplaceEntity(table, entity, callback);
    }
    static retriveEntity(tableService, table, id, callback) {
        tableService.retrieveEntity(table, id, this.rowKey, (err, result, response) => {
            let data = this.treatDataRetrieved(result);
            callback(err, data, response);
        });
    }
    static deleteEntity(tableService, table, id, callback) {
        tableService.deleteEntity(table, this.createEntity(id), function (error, response) {
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
AzureTableService.rowKey = "1";
exports.AzureTableService = AzureTableService;
//# sourceMappingURL=azure-tables-service.js.map