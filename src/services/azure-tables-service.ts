import * as azure from 'azure-storage';

export class AzureTableService {    
    private static config;
    private static rowKey = "1";
    
    static createTableService() {
        if(!this.config) {
            this.config = this.loadConfig();
        }
        
        return azure.createTableService(this.config.name, this.config.accessKey);    
    }

    static createTableIfNotExists(tableService: azure.TableService, table: string, callback: (error, result, response) => void) {        
        tableService.createTableIfNotExists(table, callback);        
    }

    static createEntity(id, data :any = {}) : any {        
        const entGen = azure.TableUtilities.entityGenerator;
        return { 
            PartitionKey: entGen.String(id),
            RowKey: entGen.String(this.rowKey),            
            Content: JSON.stringify(data)
        };
    }

    static insertOrMergeEntity(tableService: azure.TableService, table: string, entity:any, callback: (error, result, response) => void) {        
        tableService.insertOrReplaceEntity(table, entity, callback);
    }

    static retriveEntity(tableService: azure.TableService, table: string, id: string, callback: (error, result, response) => void) {                
        tableService.retrieveEntity(table, id, this.rowKey, (err, result, response) => {
            let data = this.treatDataRetrieved(result);
            callback(err, data, response);
        });
    }

    static deleteEntity(tableService: azure.TableService, table: string, id: string, callback: (error, response) => void) {
        tableService.deleteEntity(table, this.createEntity(id), function(error, response){
            callback(error, response);
        });
    }

    private static loadConfig() {
        return {
            name: process.env.AZURE_STORAGE_NAME, 
            accessKey: process.env.AZURE_STORAGE_ACCESS_KEY 
        }
    }

    private static treatDataRetrieved(data: any) {
        let new_data = {};
        if(!data)
            return null;
            
        return JSON.parse(data.Content._);
    }
}