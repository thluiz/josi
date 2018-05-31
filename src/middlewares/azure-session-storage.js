"use strict";
/* AzureSessionStore
    License: MIT
    Description: An express session store using Azure Storage Tables.
    Based on https://github.com/asilvas/express-session-azure
*/
Object.defineProperty(exports, "__esModule", { value: true });
const azure_tables_service_1 = require("./../services/azure-tables-service");
const util = require('util'), Session = require('express-session'), tableName = 'AzureSessionStore';
module.exports = AzureSessionStore;
function AzureSessionStore(options) {
    Session.Store.call(this, options);
    this.tableSvc = azure_tables_service_1.AzureTableService.createTableService();
    azure_tables_service_1.AzureTableService.createTableIfNotExists(this.tableSvc, tableName, (err) => {
    });
}
util.inherits(AzureSessionStore, Session.Store);
var p = AzureSessionStore.prototype;
p.cleanup = function () {
    return new Promise((resolve, reject) => {
        console.log('AzureSessionStore.cleaning...');
        var current_date = (Date.now() / 1000);
        var expiration = current_date - ((parseFloat(process.env.SESSION_DURATION_MINUTES) || 3600) * 60);
        azure_tables_service_1.AzureTableService.retrieveEntities(this.tableSvc, tableName, "CreatedOn le ?", [expiration.toString()], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};
p.reap = function (ms) {
    var thresh = Number(new Date(Number(new Date) - ms));
    console.log("AzureSessionStore.reap: " + thresh.toString());
};
p.get = function (sid, cb) {
    var me = this;
    azure_tables_service_1.AzureTableService.retriveEntity(this.tableSvc, tableName, sid, function (err, result) {
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
    if (!session.cookie
        || !session.cookie
        || !session.cookie.passport
        || !session.cookie.passport.user) {
        return;
    }
    let entity = azure_tables_service_1.AzureTableService.buildEntity(sid, session);
    azure_tables_service_1.AzureTableService.insertOrMergeEntity(this.tableSvc, tableName, entity, (err, results) => {
        if (err) {
            console.log(err);
            console.log("AzureSessionStore.set: " + err);
            cb(err.toString(), null);
        }
        else {
            cb(null, entity);
        }
    });
};
p.destroy = function (sid, cb) {
    azure_tables_service_1.AzureTableService.deleteEntity(this.tableSvc, tableName, sid, (err, result) => {
        if (err) {
            console.log("AzureSessionStore.destroy: " + err);
            cb(err);
        }
        cb(null, result);
    });
};
p.on = function (cmd) {
    console.log("AzureSessionStore.on." + cmd);
};
//# sourceMappingURL=azure-session-storage.js.map