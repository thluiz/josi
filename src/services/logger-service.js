"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const azure_tables_service_1 = require("./azure-tables-service");
const LOG_TABLE = "ServerLogs";
const ERROR_TABLE = "Errors";
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Info"] = 0] = "Info";
    LogLevel[LogLevel["Error"] = 1] = "Error";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LogOrigins;
(function (LogOrigins) {
    LogOrigins[LogOrigins["General"] = 0] = "General";
    LogOrigins[LogOrigins["Debug"] = 1] = "Debug";
})(LogOrigins = exports.LogOrigins || (exports.LogOrigins = {}));
var ErrorOrigins;
(function (ErrorOrigins) {
    ErrorOrigins[ErrorOrigins["Incidents"] = 0] = "Incidents";
    ErrorOrigins[ErrorOrigins["Firebase"] = 1] = "Firebase";
})(ErrorOrigins = exports.ErrorOrigins || (exports.ErrorOrigins = {}));
class LoggerService {
    static error(origin, error, details) {
        this.log(error, origin);
    }
    static log(obj, origin, level = LogLevel.Info, message, details) {
        let data = { object: obj };
        if (details) {
            data.details = details;
        }
        if (message) {
            data.message = message;
        }
        let entity = azure_tables_service_1.AzureTableService.buildEntity(new Date().getTime().toString(), data, level.toString());
        azure_tables_service_1.AzureTableService.insertOrMergeEntity(this.get_table_service(level == LogLevel.Info ? LOG_TABLE : ERROR_TABLE), level == LogLevel.Info ? LOG_TABLE : ERROR_TABLE, entity, (err, results) => {
            if (err) {
                console.log(err);
                console.log("AzureSessionStore.set: " + err);
            }
        });
    }
    static get_table_service(tbl) {
        if (this.tableService == null) {
            let tableSvc = azure_tables_service_1.AzureTableService.createTableService();
            azure_tables_service_1.AzureTableService.createTableIfNotExists(tableSvc, tbl, (err) => {
            });
            this.tableService = tableSvc;
        }
        return this.tableService;
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger-service.js.map