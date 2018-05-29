import { AzureTableService } from './azure-tables-service';

const LOG_TABLE = "Logs";
const ERROR_TABLE = "Errors";

export enum LogLevel {
    Info,    
    Error
}

export enum LogOrigins {
    General, 
    Debug
}

export enum ErrorOrigins {    
    Incidents,
    Firebase
}

export class LoggerService {
    private static tableService;    
    
    static error(origin : ErrorOrigins, error: Error, details?: any) {
        this.log(error, origin);
    }

    static log(obj, origin: ErrorOrigins | LogOrigins, level : LogLevel | string = LogLevel.Info, message?: string, details? :any) {   
        let data : any = { object: obj }
        
        if(details) {
            data.details = details;
        }

        if(message) {
            data.message = message;
        }
        
        let entity = AzureTableService.buildEntity(
            new Date().getTime().toString(), 
            data, level.toString());
    
        AzureTableService.insertOrMergeEntity(this.get_table_service(level == LogLevel.Info ? LOG_TABLE : ERROR_TABLE), 
            origin.toString(), 
            entity, (err, results) => {
            if (err) {
                console.log(err);
                console.log("AzureSessionStore.set: " + err);                        
            }
        });
    }

    private static get_table_service(tbl) {   
        if (this.tableService == null) {
            let tableSvc = AzureTableService.createTableService();
            AzureTableService.createTableIfNotExists(tableSvc, tbl, (err) => {
                        
            });

            this.tableService = tableSvc;
        }
        
        return this.tableService;
    }
}