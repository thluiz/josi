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
const sql = require("mssql");
const builder = require("botbuilder");
const express = require('express');
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});
const config = {
    database: process.env.SQL_DATABASE,
    options: {
        // use this if you're on Windows Azure
        encrypt: true,
    },
    // needed to parse the procedure result, the typescript anotation, in this case, is wrong.
    parseJSON: true,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_HOST,
    user: process.env.SQL_USER,
};
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        const pool = yield sql.connect(config);
        const app = express();
        const cors = require("cors");
        app.use(cors());
        app.post("/api/messages", connector.listen());
        app.get("/api/daily", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield pool.request().execute(`GetDailyMonitor`);
                response.send((result.recordset[0][0]));
            }
            catch (error) {
                response.send(error.message);
            }
        }));
        app.get("/test", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield pool.request().query(`select p.id,
                    isnull(pa.alias, p.[name]) name, 
                    p.branch_id, p.program_id,
                    p.domain_id
                    from person p left join person_alias pa on p.id = pa.person_id and pa.principal = 1`);
                response.send((result));
            }
            catch (error) {
                response.send(error.message);
            }
        }));
        app.get(/^((?!\.).)*$/, (req, res) => {
            var path = "index.html";
            res.sendfile(path, { root: "./apex/public" });
        });
        app.use(express.static("./apex/public"));
        const port = process.env.port || process.env.PORT || 3979;
        app.listen(port, function () {
            console.log(`server listening to ${port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
//# sourceMappingURL=server.js.map