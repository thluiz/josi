import * as sql from "mssql";
import * as builder from "botbuilder";

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

(async function () {
    try {    
        let pool = await sql.connect(config);    
        const app = express();
                
        app.post('/api/messages', connector.listen());
        app.get('/test', async (request, response, next) => {
            try {
                const result = await pool.request().query(
                    `select p.id,
                    isnull(pa.alias, p.[name]) name, 
                    p.branch_id, p.program_id,
                    p.domain_id
                    from person p left join person_alias pa on p.id = pa.person_id and pa.principal = 1`
                );

                response.send((result));
            } catch (error) {                
                response.send(error.message);
            }                                    
        });            
        
        app.get(/^((?!\.).)*$/, (req, res) => {
            var path = 'index.html';
            res.sendfile(path, {root: './public'});
        });

        app.use(express.static('public'));

        const port = process.env.port || process.env.PORT || 3979;
        app.listen(port, function () {
            console.log(`server listening to ${port}`); 
        });
        
    } catch (error) {
        console.log(error);
    } 
})();

