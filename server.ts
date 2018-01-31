import { SecurityService, Permissions } from './domain/services/security_services';
import * as sql from 'mssql';
import * as builder from 'botbuilder';
import { JobsService } from './domain/services/jobs_services';

import * as people_routes from "./api/routes/people-routes";
import * as parameters_routes from "./api/routes/parameters-routes";
import * as incidents_routes from "./api/routes/incidents-routes";

const express = require('express');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

if (process.env.LOAD_ENV === 'true') {
    require('dotenv').load();
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, cb) => {        
    SecurityService.findUser(profile.emails[0].value, cb);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user.token);
});

passport.deserializeUser(async function(token, done) {
    SecurityService.findUserByToken(token, function(err, user) {
        done(err, user);
    });
});



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

function getParticipationList(people) {
    return " **Participantes** :\n\n"
        + people.map(p => "* " + p.name).join('\n\n');
}

(async () => {
    try {    
        const pool = await SecurityService.create_pool();

        const app = express();
        const bodyParser = require("body-parser");
        const cors = require("cors");

        app.use(session({
            secret: process.env.EXPRESS_SESSION_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }
        }));
        app.use(passport.initialize());
        app.use(passport.session());
                
        app.use(helmet());
        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        
        app.get('/auth/google',
            passport.authenticate('google', { scope: ['profile', 'email'] }));

        app.get('/auth/google/callback', 
            passport.authenticate('google', { failureRedirect: '/login_error' }),
            function(req, res) {              
              res.redirect(process.env.SITE_URL);
            });            

        app.get('/oauth/google/callback', 
            passport.authenticate('google', { failureRedirect: '/login_error' }),
            function(req, res) {              
              res.redirect(process.env.SITE_URL);
            });     

        app.get('/relogin', (req, res, next) => {
            req.logout();
            res.redirect(process.env.SITE_URL);
        });

        app.get('/logout', function(req, res){
            req.logout();
            res.send("Sessão encerrada");
        });

        app.post("/api/messages", connector.listen());        
        people_routes.configure_routes(app, pool);      
        parameters_routes.configure_routes(app, pool);
        incidents_routes.configure_routes(app, pool);
        
        app.get("/api/hourly-jobs", async (request, response, next) => {            
            const jobs_service = new JobsService(pool);                
            await jobs_service.hourly_jobs();

            response.send({ sucess: true});
        });

        app.get("/api/users/current", async (request, response, next) => {                        
            let user = await SecurityService.getUserFromRequest(request);            
            response.send(user);
        });

        app.get("/api/agenda/:branch?/:date?", 
        SecurityService.ensureLoggedIn(),
        async (request, response, next) => {                        
            try {
                let result = await new sql.Request(pool)                             
                    .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                    .input('date', sql.VarChar(10), request.params.date || null)                    
                    .execute(`GetAgenda`);  
                    
                response.send((result.recordset[0]));
            } catch (error) {                                
                response.status(500);
                response.json({ error: error });
            } 
        });

        app.get("/api/current_activities/:branch?",        
        SecurityService.ensureLoggedIn(), 
        SecurityService.ensureHasPermission(Permissions.Operator),
        async (request, res, next) => {            
            try {
                let result = await new sql.Request(pool)                             
                    .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)                                        
                    .execute(`GetCurrentActivities`);   
                    
                let response = result.recordset[0];                    
                res.send(response[0].empty ? [] : response);

            } catch (error) {                                
                res.status(500)
                    .json({ error: error });
            } 
        });

        app.get("/api/daily/:branch?/:display?/:display_modifier?", 
        SecurityService.ensureLoggedIn(),
        async (request, response, next) => {            
            try {
                let result = await new sql.Request(pool)                
                    .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                    .input('display_modifier', sql.Int, request.params.display_modifier  || 0)
                    .input('display', sql.Int, request.params.display || 0)
                    .execute(`GetDailyMonitor`);  
                    

                response.send((result.recordset[0][0]));
            } catch (error) {                                
                response.status(500);
                response.json({ error: error });
            } 
        });   

        app.get("/api/people_summary/:branch?/:week?", 
        SecurityService.ensureLoggedIn(),
        async (request, response, next) => {            
            try {
                let result = await new sql.Request(pool)                
                    .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                    .input('week_modifier', sql.Int, request.params.week || 0)
                    .input('date', sql.VarChar(10), request.params.date)
                    .execute(`GetPeopleSummary`);                

                response.send((result.recordset[0]));
            } catch (error) {                                
                response.status(500);
                response.json({ error: error });
            } 
        });

        app.get("/api/sumary/:branch?/:month?/:week?/:date?", 
        SecurityService.ensureLoggedIn(),
        async (request, response, next) => {
            try {
                let result = await new sql.Request(pool)                
                    .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                    .input('month_modifier', sql.Int, request.params.month || 0)
                    .input('week_modifier', sql.Int, request.params.week || 0)
                    .input('date', sql.VarChar(10), request.params.date)                    
                    .execute(`GetSumary`);                

                response.send(result.recordset[0][0]);
            } catch (error) {                                
                response.status(500);
                response.json('error', { error: error });
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
                                                
                let moment = { title: "", people: [], fund_value: 0 };

                moment.title = title_entity ? title_entity.entity : "Provimento de Vida Kung Fu";
                                
                session.dialogData.moment = moment; 

                session.beginDialog("/findParticipants", { moment, names: names_entities.map(n => n.entity).join(",") });
            }, 
            (session, results, next) => {
                
                if(results.response.moment) {
                    session.dialogData.moment = results.response.moment;
                }
                
                const moment = session.dialogData.moment;

                if(results.response.cancel) {
                    session.endDialog("Ok, cancelando essa operação então");
                    return;    
                }

                session.beginDialog("/confirmMoment", { moment });
            }, async (session, results, next) => {
                if(results.response.cancel) {
                    session.endDialog("Ok, cancelando essa operação então");
                    return;    
                }

                if(results.response.moment 
                    && results.response.moment.dirty) {
                    session.replaceDialog("/confirmMoment", {
                        moment: results.response.moment
                    });
                    return;
                }

                const moment = results.response.moment || session.dialogData.moment;

                try {
                    session.sendTyping();

                    await new sql.Request(pool)
                                .input('participants', sql.VarChar(sql.MAX), 
                                    moment.people.map(p => p.person_id).join(',')
                                )
                                .input('fund_value', sql.Decimal(10, 2), 
                                    moment.fund_value
                                )
                                .input('title', sql.VarChar(300), 
                                    moment.title
                                )
                                .execute(`RegisterMoment`);                
                                   
                    session.endDialog("Evento registrado!");
                    
                } catch(error) {
                    session.endDialog("Ocorreu um erro ao registrar o evento: " + error.message);
                    return;
                }
            }
        ]);

        bot.dialog("/confirmMoment", [(session, args, temp) => { 

            if(args.cancel_all) {
                session.endDialogWithResult({
                    response: { cancel: true  }
                });
                return;
            }

            const moment = args.moment;
            session.dialogData.moment = moment;            

            let msg = "Estou com os seguintes dados: \n\n"
            + ` **Título** : ${moment.title} \n\n`;

            if(moment.people.length > 0) {
                msg += getParticipationList(moment.people);
            }                                                            
            
            if(moment.fund_value > 0) {
                msg += `\n\n **Valor para o fundo** : ${moment.fund_value} `;
            }
            
            session.send(msg);
            const fund_value_options = moment.fund_value > 0 ? 
                                        "Alterar valor para o fundo" 
                                        : "Adicionar valor para o fundo";

            builder.Prompts.choice(session, 
                "Posso confirmar? ", 
                `Sim|Alterar|${fund_value_options}|Cancelar`,
                { listStyle: builder.ListStyle.button });            
        }, (session, results, next) => {            
            let response = results.response;

            if(response.index === 0) {
                session.dialogData.moment.dirty = false;
                session.endDialogWithResult({
                    response: session.dialogData.moment
                });                
                return;
            }
            
            session.dialogData.moment.dirty = true;

            if(response.index === 1) {
                session.replaceDialog("/askChanges", { moment:  session.dialogData.moment } );
                return;
            }

            if(response.index === 2) {
                session.replaceDialog("/askFundValue", { 
                    moment: session.dialogData.moment
                });
                return;
            }
            
            session.endDialogWithResult({
                response: { cancel: true }
            });                          
        }]);

        bot.dialog("/askChanges", [(session, args) => { 
            session.dialogData.moment = args.moment;

            builder.Prompts.choice(session, 
                "O que deseja alterar?", 
                "Título|Adicionar participante|Remover participante|Cancelar alterações|Cancelar lançamento",
                { listStyle: builder.ListStyle.button });
        }, (session, results, next) => {
            let response = results.response;

            if(response.index === 0) {
                session.replaceDialog("/changeTitle", {
                    moment: session.dialogData.moment
                });                                
                return;
            }

            if(response.index === 1) {
                session.replaceDialog("/addParticipant", {
                    moment: session.dialogData.moment,
                });                                
                return;
            }

            if(response.index === 2) {
                session.replaceDialog("/removeParticipant", {
                    moment: session.dialogData.moment
                });                                
                return;
            }
            
            if(response.index === 3) {
                session.replaceDialog("/confirmMoment", {
                    moment: session.dialogData.moment
                });
                return;
            }

            session.replaceDialog("/confirmMoment", {                
                cancel_all: true
            });
        }]
        );



        bot.dialog("/addParticipant", [(session, args) => {             
            const moment = args.moment;
            session.dialogData.moment = moment;

            session.replaceDialog("/askNameAndSearchParticipant",{
                moment
            });
        }]);

        bot.dialog("/removeParticipant", [(session, args) => {             
            const moment = args.moment;
            session.dialogData.moment = moment;

            builder.Prompts.choice(session, 
                "Quem deseja remover? ", 
                moment.people.map(p => p.name),
                { listStyle: builder.ListStyle.button });
        }, (session, results, next) => {
            const name = results.response.entity;
            const moment = session.dialogData.moment;                        
            moment.people = moment.people
                            .filter(p => p.name != name); 

            session.replaceDialog("/changeParticipants", { moment });
        }]);

        bot.dialog("/changeParticipants", [(session, args) => {             
            session.dialogData.moment = args.moment;
            const moment = session.dialogData.moment;

            let msg = "Então a lista ficou: \n\n";
            if(moment.people.length > 0) {
                msg += getParticipationList(moment.people);
            }               
            
            builder.Prompts.choice(session, 
                "O que deseja?", 
                `Adicionar participantes|Remover participante|Continuar lançamento`,
                { listStyle: builder.ListStyle.button });     
        }, (session, results, next) => {
            let response = results.response;
            const moment = session.dialogData.moment;

            if(response.index === 0) {
                session.replaceDialog("/addParticipant", moment);
                return;
            }

            if(response.index === 1) {
                session.replaceDialog("/removeParticipant", { moment });
                return;
            }

            session.replaceDialog("/confirmMoment", {
                moment: moment
            });  
        }]);

        bot.dialog("/changeTitle", [(session, args) => {             
            session.dialogData.moment = args.moment;

            builder.Prompts.text(session, "Poderia informar o título então?");
            
        }, (session, results, next) => {
            const moment = session.dialogData.moment;
            moment.title = results.response;

            session.replaceDialog("/confirmMoment", {
                moment: moment
            });  
        }]);

        bot.dialog("/askFundValue", [(session, args) => {
            session.dialogData.moment = args.moment;                 

            builder.Prompts.number(session, "Poderia informar o valor que será destinado para o fundo?");        
        }, (session, results, next) => {
            const moment = session.dialogData.moment;
            moment.fund_value = results.response;

            session.replaceDialog("/confirmMoment", {
                moment: moment
            });  
        }]);        

        bot.dialog("/askNameAndSearchParticipant", [(session, args) => {
            session.dialogData.moment = args.moment;
            builder.Prompts.text(session, "Poderia informar o nome então?");            
        }, (session, results, next) => {
            session.replaceDialog("/findParticipants", {
                names: results.response,
                moment: session.dialogData.moment
            });          
        }]);

        bot.dialog("/findParticipants", [async (session, args) => { 

            if(args) {
                if(args.moment) {                
                    session.dialogData.moment = args.moment;
                }

                if(args.names) {                
                    session.dialogData.names = args.names;
                }
            }
            
            let names = session.dialogData.names;

            if(!names || names.length == 0) {
                //session.replaceDialog("/askNameAndSearchParticipant", { moment: session.dialogData.moment });
                //return;
            }
            
            session.dialogData.query = [];

            if(names != null && names.length > 0) {
                try {
                    session.sendTyping();
                    const result = await new sql.Request(pool)
                                    .input('names', sql.VarChar(sql.MAX), names)
                                    .execute(`GetPeopleByNameForBot`);                
                                        
                    session.dialogData.query = result.recordset;                    
                } catch(error) {
                    session.endDialogWithResult({
                        response: { 
                            error: "Ocorreu um erro ao obter os participantes: " + error.message 
                        }
                    });
                    return;
                }
            }

            const not_founds = session.dialogData.query.filter(f => !f.found);                
            const people = session.dialogData.query.filter(f => f.found && f.total == 1);
            const many_options = session.dialogData.query.filter(f => f.found && f.total > 1);

            if(!session.dialogData.moment.people) {
                session.dialogData.moment.people = [];
            }

            session.dialogData.moment.people = session.dialogData.
                                        moment.people.concat(people.filter(p => {   
                                            return !session.dialogData.moment.people.find(p2 => p2.person_id == p.person_id);
                                        }));
                         
            if(not_founds.length > 0) {    
                const msg = not_founds.length == 1?
                            "não encontrei a seguinte pessoa: " + not_founds[0].name
                            : "não encontrei as seguintes pessoas: " + not_founds.map(n => n.name).join(",");
                session.send(msg);            
                //session.replaceDialog("/confirmMoment", {
                //    not_founds, moment: session.dialogData.moment
                //});                
            }

            if(many_options.length > 0) {                
                session.replaceDialog("/choosePersonInList", {
                    many_options, moment: session.dialogData.moment
                });
                return;
            }
            
            session.endDialogWithResult({
                response: { moment: session.dialogData.moment }
            });
        }]);

        bot.dialog("/choosePersonInList", [(session, args) => {             
            session.dialogData.moment = args.moment;            
            session.dialogData.current_options = args.many_options.shift();            
            session.dialogData.many_options = args.many_options;
            
            if(!session.dialogData.current_options) {
                session.endDialogWithResult({
                    response: { moment: session.dialogData.moment }
                });
                return;
            }

            let options = JSON.parse(session.dialogData.current_options.options);
            options.push({id: -1, name: "Ignorar esse nome"});
            session.dialogData.options = options;

            builder.Prompts.choice(session, 
                `O nome '${session.dialogData.current_options.name}' possui algumas opções, qual seria?`, 
                options.map(p => p.name),
                { listStyle: builder.ListStyle.button });   
        }, (session, result, next) => {
            const moment = session.dialogData.moment;                        
            const many_options = session.dialogData.many_options;
            const options = session.dialogData.options;

            if(result.response.index === options.length) {
                session.replaceDialog("/choosePersonInList", {
                    moment, many_options
                });
                return;
            }
            
            moment.people.push(session.dialogData.options[result.response.index]);

            session.replaceDialog("/choosePersonInList", {
                moment, many_options
            });
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

