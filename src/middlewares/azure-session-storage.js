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
const logger_service_1 = require("../services/logger-service");
/* AzureSessionStore
    License: MIT
    Description: An express session store using Azure Storage Tables.
    Based on https://github.com/asilvas/express-session-azure
*/
const azure_tables_manager_1 = require("../services/managers/azure-tables-manager");
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
const util = require('util'), Session = require('express-session'), tableName = 'AzureSessionStore';
module.exports = AzureSessionStore;
function AzureSessionStore(options) {
    Session.Store.call(this, options);
    this.tableSvc = azure_tables_manager_1.AzureTableManager.createTableService();
    azure_tables_manager_1.AzureTableManager.createTableIfNotExists(this.tableSvc, tableName, (err) => {
    });
}
util.inherits(AzureSessionStore, Session.Store);
var p = AzureSessionStore.prototype;
function _retriveEntites(self, query, parameters) {
    return new Promise((resolve, reject) => {
        azure_tables_manager_1.AzureTableManager.retrieveEntities(self.tableSvc, tableName, query, parameters, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result.entries);
        });
    });
}
function retriveOldEntites(self) {
    return __awaiter(this, void 0, void 0, function* () {
        var current_date = Math.floor(Date.now() / 1000);
        var expiration = current_date - (parseFloat(process.env.SESSION_DURATION_MINUTES)
            || (3600 * 6 /*default 6 hours*/));
        return yield _retriveEntites(self, "CreatedOn le ?", expiration);
    });
}
function retriveTestEntites(self) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield _retriveEntites(self, "Test eq ?", true);
    });
}
function deleteEntity(self, sid) {
    return new Promise((resolve, reject) => {
        azure_tables_manager_1.AzureTableManager.deleteEntity(self.tableSvc, tableName, sid, (errDel, result) => {
            if (errDel) {
                logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.SessionControl, errDel);
                return;
            }
            resolve(result_1.SuccessResult.GeneralOk());
        });
    });
}
p.cleanup = function cleanup() {
    let self = this;
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        console.log('AzureSessionStore.start_cleaning...');
        try {
            const old_entries = yield retriveOldEntites(self);
            const test_entries = yield retriveTestEntites(self);
            let entries = old_entries.concat(test_entries);
            let batch = azure_tables_manager_1.AzureTableManager.createTableBatch();
            for (let i = 0; i < entries.length; i++) {
                batch.deleteEntity(entries[i]);
                if (i > 0 && i % 99 == 0) {
                    let result = yield azure_tables_manager_1.AzureTableManager.executeBatch(self.tableSvc, tableName, batch);
                    console.log(`deleted ${batch.operations.length} entries!`);
                    batch = azure_tables_manager_1.AzureTableManager.createTableBatch();
                }
            }
            if (batch.operations.length > 0) {
                yield azure_tables_manager_1.AzureTableManager.executeBatch(self.tableSvc, tableName, batch);
                console.log(`finally: deleted ${batch.operations.length} entries!`);
            }
            console.log("AzureSessionStore.end_session_cleaning");
            resolve(result_1.SuccessResult.GeneralOk());
        }
        catch (error) {
            reject(result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error));
        }
    }));
};
p.reap = function (ms) {
    var thresh = Number(new Date(Number(new Date) - ms));
    console.log("AzureSessionStore.reap: " + thresh.toString());
};
p.get = function (sid, cb) {
    var me = this;
    azure_tables_manager_1.AzureTableManager.retriveEntity(this.tableSvc, tableName, sid, function (err, result) {
        if (err) {
            if (err.code == "ResourceNotFound") {
                cb();
            }
            else {
                cb(err);
            }
        }
        else {
            cb(null, result);
        }
    });
};
p.set = function (sid, session, cb) {
    const me = this;
    let entity = azure_tables_manager_1.AzureTableManager.buildEntity(sid, session);
    azure_tables_manager_1.AzureTableManager.insertOrMergeEntity(this.tableSvc, tableName, entity, (err, results) => {
        if (err) {
            console.log("AzureSessionStore.set: " + err);
            cb(err.toString(), null);
        }
        else {
            cb(null, entity);
        }
    });
};
p.destroy = function (sid, cb) {
    deleteEntity(this, sid)
        .then(result => cb(null, result));
};
p.on = function (cmd) {
    console.log("AzureSessionStore.on." + cmd);
};
//# sourceMappingURL=azure-session-storage.js.map