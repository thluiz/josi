import * as sql from 'mssql';
import * as builder from 'botbuilder';

const express = require('express');

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);
const recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT);
const dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", dialog);
bot.endConversationAction("reset", "ok, cancelando tudo...", { matches: /^cancelar/i });


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

(async () => {
    try {    
        const pool = await sql.connect(config);    
        const app = express();
        const cors = require("cors");

        app.use(cors());

        app.post("/api/messages", connector.listen());

        app.get("/api/daily", async (request, response, next) => {
            try {
                const result = await pool.request().execute(`GetDailyMonitor`);                

                response.send((result.recordset[0][0]));
            } catch (error) {                
                response.send(error.message);
            } 
        });

        app.get("/test", async (request, response, next) => {
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
            var path = "index.html";
            res.sendfile(path, {root: "./apex/public"});
        });

        app.use(express.static("./apex/public"));

        /**************************** 
         * BOT
        ********************/        

        dialog.matches("None", [
            async (session, args, next) => {
                session.endDialog("Acho que não entendi... vc pode pedir ajuda com 'help', 'ajuda', 'socorro' etc para obter a lista de comandos disponíveis");
            }
        ]);

        dialog.matches("Help", [
            async (session, args, next) => {
                let msg = "Atualmente eu posso apenas registrar momentos de vida kung fu para o diário. \n\n "
                            + "Você pode pedir algo como: \n\n"
                            + `* _"Registrar um momento com o André"_ \n\n`
                            + `* _"Informar sobre um almoço com o Cris"_ \n\n`
                            + `* _"Gostaria de registrar uma refeição com o Cláudio, a Alice e o Iuri"_ \n\n`
                            + `* _"Lançar um jantar com o Si Fu, Pereira, Pedro Oliveira e a Rubia"_ \n\n\n\n`
                            + `Lembrando que se vc estiver preso em algum ponto pode usar o comando [cancelar] que eu recomeço a conversa `;

                session.endDialog(msg);
            }
        ]);

        dialog.matches("Greetings", [
            async (session, args, next) => {
                session.endDialog("Saudações!");
            }
        ]);

        dialog.matches("Thanks", [
            async (session, args, next) => {
                session.endDialog("Disponha!");
            }
        ]);

        dialog.matches("RegisterMoment", [
            async (session, args, next) => {
                const title_entity = builder.EntityRecognizer.findEntity(args.entities, "title");
                const names_entities = builder.EntityRecognizer.findAllEntities(args.entities, "person_name");
                                
                
                let moment = { title: "", people: []};

                moment.title = title_entity ? title_entity.entity : "Provimento de Vida Kung Fu";

                session.sendTyping();

                try {
                    const result = await pool.request()
                                    .input('names', sql.VarChar(sql.MAX), 
                                        names_entities.map(n => n.entity).join(","))
                                    .execute(`GetPeopleByName`);                
                                        
                    session.dialogData.query = result.recordset;                    
                } catch(error) {
                    session.endDialog("Ocorreu um erro ao obter os participantes: " + error.message);
                    return;
                }

                const not_founds = session.dialogData.query.filter(f => !f.found);                
                const people = session.dialogData.query.filter(f => f.found && f.total == 1);

                moment.people = people;
                
                session.dialogData.moment = moment; 

                session.beginDialog("/confirmMoment", { moment });

            }, (session, results, next) => {
                console.log(results.response);
                session.send("ok!");
                session.send(results.response);
            }
        ]);

        bot.dialog("/confirmMoment", [(session, args) => { 
            const moment = args.moment;
            session.dialogData.moment = moment;
            console.log(args.moment);

            let msg = "Os dados que consegui foram: \n\n"
            + ` **Título** : ${moment.title} \n\n`;

            if(moment.people.length > 0) {
                msg += " **Participantes** :\n\n"
                        + moment.people.map(p => "* " + p.name).join('\n\n');
            }                                                                          
            session.send(msg);

            builder.Prompts.choice(session, 
                "Posso confirmar? ", 
                "Sim|Alterar o Título|Adicionar Comentário|Cancelar",
                { listStyle: builder.ListStyle.button });            
        }, (session, results, next) => {
            console.log(results);
            let response = results.response;
            session.endDialogWithResult({ response: response.entity });
            if(response.index === 0) {
                //session.endDialogWithResult( { response: { moment: session.dialogData.moment } });
                return;
            }

            if(response.index === 1) {
                //session.replaceDialog("/askTitle", { moment:  session.dialogData.moment } );
                return;
            }

            if(response.index === 2) {
                //session.replaceDialog("/askComentary", { moment: session.dialogData.moment});
                return;
            }

            if(response.index === 3) {
                //session.endDialog("Ok, depois continuamos...");
                return;
            }            
        }]);

        bot.dialog("/askTitle", [(session, args) => { 
            console.log(args);
            session.dialogData.moment = args.moment;

            builder.Prompts.text(session, "Poderia então informar o título?");            
        }, (session, results, next) => {
            let moment = session.dialogData.moment;
            moment.title = results.response;

            session.replaceDialog("/confirmMoment", { response: { moment }});
        }]);        

        bot.dialog("/askComentary", [(session, args) => {             
            session.dialogData.moment = args.moment;

            builder.Prompts.text(session, "Poderia então informar a descrição?");            
        }, (session, results, next) => {
            let moment = session.dialogData.moment;
            moment.public = results.response;

            session.replaceDialog("/confirmMoment", { response: {  moment }});
        }]);  

        bot.dialog("/askValue", [(session, args) => { 
            console.log("askValue");
            session.endDialogWithResult( { response: {  cancel_all: true}} );
        }]);        

        bot.dialog("/findParticipants", [(session, args) => { 
            session.dialogData.not_founds = args.not_founds; 
            let not_founds = args.not_founds.filter(f => !f.found);

            if(not_founds.length == 0) {
                session.endDialogWithResult({ response: not_founds });
                return;
            }

            const current_missing = not_founds[0];
            session.dialogData.current_missing = current_missing;
            
            if(current_missing.options.length > 0) {
                session.beginDialog("/choosePersonInList", { options: current_missing.options })                
            } else {
                session.beginDialog("/lookForNameOrCreate", { person: current_missing })                                
            }                          
        },
        async (session, results, next) => {
            let response = results.response;

            if(response.cancel_all) {
                session.endDialogWithResult({ response: { cancel_all : true} });
                return;
            }            
        }  
        ]);

        bot.dialog("/choosePersonInList", [(session, args) => { 
            console.log("choosePersonInList");
        }]);

        bot.dialog("/lookForNameOrCreate", [(session, args) => { 
            console.log("lookForNameOrCreate");
        }]);


        /****************************
         * SERVER
         *********************/        

        const port = process.env.port || process.env.PORT || 3979;
        app.listen(port, function () {
            console.log(`server listening to ${port}`); 
        });
        
    } catch (error) {
        console.log(error);
    } 
})();

