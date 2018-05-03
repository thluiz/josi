import * as azure from 'azure-storage';

export class AzureTableService {    
    private static config;
    
    static createTableService() {
        if(!this.config) {
            this.config = this.loadConfig();
        }
        
        return azure.createTableService(this.config.name, this.config.accessKey);    
    }

    static createTableIfNotExists(tableService: azure.TableService, table: string, callback: (error, result, response) => void) {        
        tableService.createTableIfNotExists(table, callback);        
    }

    static buildEntity(id, data :any = {}, partition = 'principal') : any {        
        const entGen = azure.TableUtilities.entityGenerator;
        const date = new Date();
        return { 
            PartitionKey: entGen.String(partition),
            RowKey: entGen.String(id),
            CreatedOn: Math.floor( Date.now() / 1000 ),
            Test: process.env.LOAD_ENV === 'true',
            Content: JSON.stringify(data)
        };
    }

    static insertOrMergeEntity(tableService: azure.TableService, table: string, entity:any, callback: (error, result, response) => void) {        
        tableService.insertOrReplaceEntity(table, entity, callback);
    }

    static retriveEntity(tableService: azure.TableService, table: string, id: string, callback: (error, result, response) => void, partition = 'principal') {                
        tableService.retrieveEntity(table, partition, id, (err, result, response) => {
            let data = this.treatDataRetrieved(result);
            callback(err, data, response);
        });
    }

    static deleteEntity(tableService: azure.TableService, table: string, id: string, callback: (error, response) => void) {
        tableService.deleteEntity(table, this.buildEntity(id), function(error, response){
            callback(error, response);
        });
    }

    static retrieveEntities(tableService: azure.TableService, table: string, query: string, parameters: string[], callback: (error, response) => void) {        
        var azure_query = new azure.TableQuery().where(query, parameters);

        tableService.queryEntities(table, azure_query, null, function(error, result, response) {
            if(error) {
              callback(error, null)
            }

            console.log(result);
            console.log(response);
        });

        callback(null, true);
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