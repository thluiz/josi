/* AzureSessionStore
    License: MIT
    Description: An express session store using Azure Storage Tables.
*/

var
    async = require("async"),
    azure = require('azure-storage'),
    util = require('util'),
    Session = require('express-session');
;

module.exports = AzureSessionStore;

function AzureSessionStore(options) {
    this.config = options || {};
    Session.Store.call(this, options);

    //console.dir(this.config);
    this.table = azure.createTableService(this.config.name, this.config.accessKey, this.config.host, this.config.authenticationProvider);
    console.log(this.table);
}

util.inherits(AzureSessionStore, Session.Store);

var p = AzureSessionStore.prototype;

p.reap = function (ms) {
    var thresh = Number(new Date(Number(new Date) - ms));
    console.log("AzureSessionStore.reap: " + thresh.toString());
};

p.get = function (sid, cb) {
    console.log("SID GET");
    console.log(sid);

    var me = this;

    this.table.retrieveEntity('AzureSessionStore', sid, '1', function (err, result) {
        if (err) {
            console.log("AzureSessionStore.get: " + err);            
            if (err.code == "ResourceNotFound") {                
                cb();
            } else if (err.code == "TableNotFound") {
                me.table.createTableIfNotExists('AzureSessionStore', function (err) {
                    if (err) {
                        console.log("AzureSessionStore.get.createTableIfNotExists: " + err);
                    }
                    me.get(sid, cb);
                });
            } else {
                cb(err);
            }
        } else {
            console.log("AzureSessionStore.get SUCCESS");
            console.log("BEFORE PARSE")
            console.dir(result);
            cb(null, result);
        }
    });
}

p.set = function (sid, session, cb) {
    console.log("SID SET");
    console.log("AzureSessionStore.set: ");
    console.dir(session);
        
    console.log(sid);

    let new_session = {
        PartitionKey: sid,
        RowKey: '1'
    }

    for (var k in session) {            
        var v = session[k];
        var t = typeof v;
        console.log(k);
        console.log(v);
        console.log(t);

        switch (t) {
            case "string":
            case "number":
                new_session[k] = v;
                break;
            case "object":
                new_session[k] = JSON.stringify(v);
                break;
        }
    }

    var me = this;
    console.log("SET - SESSION");
    console.log(session);
    console.log("SET - NEW SESSION");
    console.dir(new_session);
    this.table.insertOrMergeEntity('AzureSessionStore', new_session, function (err, results) {
        if (err) {
            console.log("AzureSessionStore.set: " + err);
            if (err.code == "TableNotFound") {
                me.table.createTableIfNotExists('AzureSessionStore', function (err) {
                    if (err) {
                        console.log("AzureSessionStore.set.createTableIfNotExists: " + err);
                    }
                    me.set(sid, session, cb);
                });

            } else {
                cb(err.toString(), null);
            }
        } else {
            console.dir(results);
            console.log("AzureSessionStore.set SUCCESS");
            console.dir(session);
            cb(null, new_session);
        }
    });
}

p.destroy = function (sid, cb) {
    this.table.deleteEntity('AzureSessionStore', { PartitionKey: sid, RowKey: '1' }, function (err) {
        if (err) {
            console.log("AzureSessionStore.destroy: " + err);
        }

        cb();
    });
}

p.on = function (cmd) {
    console.log("AzureSessionStore.on." + cmd);
}