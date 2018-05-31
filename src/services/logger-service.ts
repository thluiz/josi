import { AzureTableService } from './azure-tables-service';

const LOG_TABLE = "ServerLogs";
const ERROR_TABLE = "Errors";

export enum LogLevel {
    Info,    
    Error,
    Benchmark
}

export enum LogOrigins {
    General, 
    Debug    
}

export enum ErrorOrigins {    
    Incidents,
    Firebase,
    UnhandledRejection
}

export class LoggerService {
    private static tableService;    
    
    static error(origin : ErrorOrigins, error: Error, details?: any) {
        this.log(error, origin);
    }

    static info(message?: string, details? :any) {
        this.log({}, LogOrigins.General, LogLevel.Info, message, details);
    }

    static benchmark(operation_key : string, message?: string, details? :any) {
        this.log({}, LogOrigins.General, LogLevel.Benchmark, message, details, operation_key);
    }

    static log(obj, origin: ErrorOrigins | LogOrigins, level : LogLevel | string = LogLevel.Info, 
        message?: string, details? :any, customKey? : number | string) {   

        let data : any = { object: obj }
        
        if(details) {
            data.details = details;
        }

        if(message) {
            data.message = message;
        }
        
        let entity = AzureTableService.buildEntity(
            customKey || new Date().getTime().toString(), 
            data, level.toString());
    
        AzureTableService.insertOrMergeEntity(
            this.get_table_service(level == LogLevel.Info || LogLevel.Benchmark ? LOG_TABLE : ERROR_TABLE), 
            level == LogLevel.Info || LogLevel.Benchmark ? LOG_TABLE : ERROR_TABLE, 
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