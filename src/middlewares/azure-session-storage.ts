import { LoggerService } from '../services/logger-service';

/* AzureSessionStore
    License: MIT
    Description: An express session store using Azure Storage Tables.
    Based on https://github.com/asilvas/express-session-azure
*/

import { AzureTableService } from '../services/azure-tables-service';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';

const util = require('util'),
    Session = require('express-session'),
    tableName = 'AzureSessionStore';

module.exports = AzureSessionStore;

function AzureSessionStore(options) {
    Session.Store.call(this, options);

    this.tableSvc = AzureTableService.createTableService();
    AzureTableService.createTableIfNotExists(this.tableSvc, tableName, (err) => {

    });
}

util.inherits(AzureSessionStore, Session.Store);

var p = AzureSessionStore.prototype;

function _retriveEntites(self, query, parameters) {
    return new Promise((resolve, reject) => {
        AzureTableService.retrieveEntities(self.tableSvc, tableName,
            query, parameters,
            (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result.entries);
            }
        );
    });
}

async function retriveOldEntites(self) {
    var current_date = Math.floor(Date.now() / 1000);
    var expiration = current_date - (parseFloat(process.env.SESSION_DURATION_MINUTES)
                                    || (3600 * 6 /*default 6 hours*/))

    return await _retriveEntites(self, "CreatedOn le ?", expiration);
}

async function retriveTestEntites(self) {
    return await _retriveEntites(self, "Test eq ?", true);
}

function deleteEntity(self, sid) {
    return new Promise((resolve, reject) => {
        AzureTableService.deleteEntity(
            self.tableSvc, tableName, sid,

            (errDel, result) => {
                if (errDel) {
                    LoggerService.error(
                        ErrorCode.SessionControl, errDel
                    );
                    return;
                }

                resolve(Result.GeneralOk());
            }
        );
    });
}

p.cleanup = function cleanup() {
    let self = this;

    return new Promise(async (resolve, reject) => {
        console.log('AzureSessionStore.start_cleaning...');

        try {
            const old_entries = await retriveOldEntites(self) as any[];
            const test_entries = await retriveTestEntites(self) as any[];

            let entries = old_entries.concat(test_entries);

            let batch = AzureTableService.createTableBatch();
            for (let i = 0; i < entries.length; i++) {
                batch.deleteEntity(entries[i]);

                if (i > 0 && i % 99 == 0) {
                    let result = await AzureTableService.executeBatch(self.tableSvc, tableName, batch);
                    console.log(`deleted ${batch.operations.length} entries!`);
                    batch = AzureTableService.createTableBatch();
                }
            }

            if (batch.operations.length > 0) {
                await AzureTableService.executeBatch(self.tableSvc, tableName, batch);
                console.log(`finally: deleted ${batch.operations.length} entries!`);
            }

            console.log("AzureSessionStore.end_session_cleaning");
            resolve(Result.GeneralOk());

        } catch (error) {
            reject(Result.Fail(ErrorCode.GenericError, error));
        }
    });
};

p.reap = function (ms) {
    var thresh = Number(new Date(Number(new Date) - ms));
    console.log("AzureSessionStore.reap: " + thresh.toString());
};

p.get = function (sid, cb) {
    var me = this;
    AzureTableService.retriveEntity(this.tableSvc, tableName, sid, function (err, result) {
        if (err) {
            if (err.code == "ResourceNotFound") {
                cb();
            } else {
                cb(err);
            }
        } else {
            cb(null, result);
        }
    });
}

p.set = function (sid, session, cb) {
    const me = this;

    let entity = AzureTableService.buildEntity(sid, session);

    AzureTableService.insertOrMergeEntity(this.tableSvc, tableName, entity, (err, results) => {
        if (err) {
            console.log("AzureSessionStore.set: " + err);
            cb(err.toString(), null);
        } else {

            cb(null, entity);

        }
    });
}

p.destroy = function (sid, cb) {
    deleteEntity(this, sid)
        .then(result => cb(null, result));
}

p.on = function (cmd) {
    console.log("AzureSessionStore.on." + cmd);
}