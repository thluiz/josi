/* AzureSessionStore
    License: MIT
    Description: An express session store using Azure Storage Tables. 
    Based on https://github.com/asilvas/express-session-azure
*/

import { AzureTableService } from './../services/azure-tables-service';

const util = require('util'),
    Session = require('express-session'),
    tableName = 'AzureSessionStore';

module.exports = AzureSessionStore;

function AzureSessionStore(options) {    
    Session.Store.call(this, options);
    
    this.tableSvc = AzureTableService.createTableService();
    AzureTableService.createTableIfNotExists(this.tableSvc, tableName, (err) => {
        console.log(err);
    });
}

util.inherits(AzureSessionStore, Session.Store);

var p = AzureSessionStore.prototype;

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
    console.log(sid);  
    const me = this;
    let entity = AzureTableService.createEntity(sid, session);
    console.log(entity);
    AzureTableService.insertOrMergeEntity(this.tableSvc, tableName, entity, function (err, results) {
        if (err) {
            console.log(err);
            console.log("AzureSessionStore.set: " + err);            
            cb(err.toString(), null);            
        } else {            
            cb(null, entity);
        }
    });
}

p.destroy = function (sid, cb) {    
    this.table.deleteEntity('AzureSessionStore', sid, function (err, result) {
        if (err) {
            console.log("AzureSessionStore.destroy: " + err);
            cb(err)
        }

        cb(null, result);
    });
}

p.on = function (cmd) {
    console.log("AzureSessionStore.on." + cmd);
}