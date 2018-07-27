"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const azure_tables_service_1 = require("./azure-tables-service");
const errors_codes_1 = require("../helpers/errors-codes");
const LOG_TABLE = "ServerLogs";
const ERROR_TABLE = "Errors";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Error"] = 1] = "Error";
    LogLevel[LogLevel["Benchmark"] = 2] = "Benchmark";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LogOrigins;
(function (LogOrigins) {
    LogOrigins[LogOrigins["General"] = 0] = "General";
    LogOrigins[LogOrigins["Debug"] = 1] = "Debug";
    LogOrigins[LogOrigins["ExternalResource"] = 2] = "ExternalResource";
})(LogOrigins = exports.LogOrigins || (exports.LogOrigins = {}));
class LoggerService {
    static error(origin, error, details) {
        let obj = error;
        if (details) {
            obj.details = details;
        }
        this.log(obj, origin, LogLevel.Error);
    }
    static info(origin, details) {
        this.log(details, origin, LogLevel.Info);
    }
    static benchmark(operation_key, details) {
        this.log(details, LogOrigins.General, LogLevel.Benchmark, operation_key);
    }
    static log(obj, origin, level = LogLevel.Info, customKey) {
        let tbl = (level == LogLevel.Info || level == LogLevel.Benchmark) ?
            LOG_TABLE : ERROR_TABLE;
        let partition = (level == LogLevel.Info || level == LogLevel.Benchmark) ?
            LogLevel[level] : errors_codes_1.ErrorCode[origin];
        let entity = azure_tables_service_1.AzureTableService.buildEntity(customKey || new Date().getTime().toString(), obj, partition);
        azure_tables_service_1.AzureTableService.insertOrMergeEntity(this.get_table_service(), tbl, entity, (err, _results) => {
            if (err) {
                console.log(err);
                console.log("AzureSessionStore.set: " + err);
            }
        });
    }
    static get_table_service() {
        if (this.tableService == null) {
            let tableSvc = azure_tables_service_1.AzureTableService.createTableService();
            this.tableService = tableSvc;
        }
        return this.tableService;
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger-service.js.map