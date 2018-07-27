import { AzureTableService } from './azure-tables-service';
import { ErrorCode } from '../helpers/errors-codes';

const LOG_TABLE = "ServerLogs";
const ERROR_TABLE = "Errors";

export enum LogLevel {
    Info,
    Error,
    Benchmark
}

export enum LogOrigins {
    General,
    Debug,
    ExternalResource
}

export class LoggerService {
    private static tableService;

    static error(origin : ErrorCode, error: Error, details? :any) {
        let obj = error as any;

        if(details) {
            obj.details = details;
        }

        this.log(obj, origin, LogLevel.Error);
    }

    static info(origin : LogOrigins, details? :any) {
        this.log(details, origin, LogLevel.Info);
    }

    static benchmark(operation_key : string, details? :any) {
        this.log(details, LogOrigins.General, LogLevel.Benchmark, operation_key);
    }

    static log(obj, origin: ErrorCode | LogOrigins, level : LogLevel | string = LogLevel.Info,
        customKey? : number | string) {

        let tbl = (level == LogLevel.Info || level == LogLevel.Benchmark) ?
                        LOG_TABLE : ERROR_TABLE;
        let partition = (level == LogLevel.Info || level == LogLevel.Benchmark) ?
                        LogLevel[level] : ErrorCode[origin];

        let entity = AzureTableService.buildEntity(
            customKey || new Date().getTime().toString(),
            obj, partition);

        AzureTableService.insertOrMergeEntity(
            this.get_table_service(), tbl,
            entity, (err, _results) => {
            if (err) {
                console.log(err);
                console.log("AzureSessionStore.set: " + err);
            }
        });
    }

    private static get_table_service() {
        if (this.tableService == null) {
            let tableSvc = AzureTableService.createTableService();

            this.tableService = tableSvc;
        }

        return this.tableService;
    }
}