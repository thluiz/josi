"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.LOAD_ENV === 'true') {
    require('dotenv').load();
}
require("reflect-metadata");
var security_services_1 = require("./domain/services/security_services");
var sql = require("mssql");
var builder = require("botbuilder");
var jobs_services_1 = require("./domain/services/jobs_services");
var people_routes = require("./api/routes/people-routes");
var parameters_routes = require("./api/routes/parameters-routes");
var incidents_routes = require("./api/routes/incidents-routes");
var cards_routes = require("./api/routes/cards-routes");
var financial_routes = require("./api/routes/financial-routes");
var voucher_routes = require("./api/routes/voucher-routes");
var express = require('express');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, function (accessToken, refreshToken, profile, cb) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        security_services_1.SecurityService.findUser(profile.emails[0].value, cb);
        return [2 /*return*/];
    });
}); }));
passport.serializeUser(function (user, done) {
    done(null, user.token);
});
passport.deserializeUser(function (token, done) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            security_services_1.SecurityService.findUserByToken(token, function (err, user) {
                done(err, user);
            });
            return [2 /*return*/];
        });
    });
});
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var recognizer = new builder.LuisRecognizer(process.env.LUIS_ENDPOINT);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog("/", dialog);
bot.endConversationAction("reset", "ok, cancelando tudo...", { matches: /^cancelar/i });
var config = {
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
        + people.map(function (p) { return "* " + p.name; }).join('\n\n');
}
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var pool_1, app, bodyParser, cors, port_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, security_services_1.SecurityService.create_pool()];
            case 1:
                pool_1 = _a.sent();
                app = express();
                bodyParser = require("body-parser");
                cors = require("cors");
                app.use(session({
                    secret: process.env.EXPRESS_SESSION_KEY,
                    resave: false,
                    maxAge: 6 * 60 * 60 * 1000,
                    saveUninitialized: true,
                    cookie: { secure: false }
                }));
                app.use(passport.initialize());
                app.use(passport.session());
                app.use(helmet());
                app.use(cors());
                app.use(bodyParser.urlencoded({ extended: false }));
                app.use(bodyParser.json());
                app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
                app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login_error' }), function (req, res) {
                    res.redirect(process.env.SITE_URL);
                });
                app.get('/oauth/google/callback', passport.authenticate('google', { failureRedirect: '/login_error' }), function (req, res) {
                    res.redirect(process.env.SITE_URL);
                });
                app.get('/relogin', function (req, res, next) {
                    req.logout();
                    res.redirect(process.env.SITE_URL);
                });
                app.get('/logout', function (req, res) {
                    req.logout();
                    res.send("Sessão encerrada");
                });
                app.post("/api/messages", connector.listen());
                people_routes.configure_routes(app, pool_1);
                parameters_routes.configure_routes(app, pool_1);
                incidents_routes.configure_routes(app, pool_1);
                cards_routes.configure_routes(app, pool_1);
                financial_routes.configure_routes(app, pool_1);
                voucher_routes.configure_routes(app, pool_1);
                app.get("/api/hourly-jobs", function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
                    var jobs_service;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                jobs_service = new jobs_services_1.JobsService(pool_1);
                                return [4 /*yield*/, jobs_service.hourly_jobs()];
                            case 1:
                                _a.sent();
                                response.send({ sucess: true });
                                return [2 /*return*/];
                        }
                    });
                }); });
                app.get("/api/agenda/:branch?/:date?", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var result, response, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, new sql.Request(pool_1)
                                        .input('branch', sql.Int, req.params.branch > 0 ? req.params.branch : null)
                                        .input('date', sql.VarChar(10), req.params.date || null)
                                        .execute("GetAgenda")];
                            case 1:
                                result = _a.sent();
                                response = result.recordset[0];
                                res.send(response[0].empty ? [] : response);
                                return [3 /*break*/, 3];
                            case 2:
                                error_2 = _a.sent();
                                res.status(500);
                                res.json({ error: error_2 });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.get("/api/current_activities/:branch?", security_services_1.SecurityService.ensureLoggedIn(), security_services_1.SecurityService.ensureHasPermission(security_services_1.Permissions.Operator), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
                    var result, response, error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, new sql.Request(pool_1)
                                        .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                                        .execute("GetCurrentActivities")];
                            case 1:
                                result = _a.sent();
                                response = result.recordset[0];
                                res.send(response[0].empty ? [] : response);
                                return [3 /*break*/, 3];
                            case 2:
                                error_3 = _a.sent();
                                res.status(500)
                                    .json({ error: error_3 });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.get("/api/daily/:branch?/:display?/:display_modifier?", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
                    var result, error_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, new sql.Request(pool_1)
                                        .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                                        .input('display_modifier', sql.Int, request.params.display_modifier || 0)
                                        .input('display', sql.Int, request.params.display || 0)
                                        .execute("GetDailyMonitor")];
                            case 1:
                                result = _a.sent();
                                response.send((result.recordset[0][0]));
                                return [3 /*break*/, 3];
                            case 2:
                                error_4 = _a.sent();
                                response.status(500);
                                response.json({ error: error_4 });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.get("/api/people_summary/:branch?/:week?", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
                    var result, error_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, new sql.Request(pool_1)
                                        .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                                        .input('week_modifier', sql.Int, request.params.week || 0)
                                        .input('date', sql.VarChar(10), request.params.date)
                                        .execute("GetPeopleSummary")];
                            case 1:
                                result = _a.sent();
                                response.send((result.recordset[0]));
                                return [3 /*break*/, 3];
                            case 2:
                                error_5 = _a.sent();
                                response.status(500);
                                response.json({ error: error_5 });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.get("/api/sumary/:branch?/:month?/:week?/:date?", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
                    var result, error_6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, new sql.Request(pool_1)
                                        .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                                        .input('month_modifier', sql.Int, request.params.month || 0)
                                        .input('week_modifier', sql.Int, request.params.week || 0)
                                        .input('date', sql.VarChar(10), request.params.date)
                                        .execute("GetSumary")];
                            case 1:
                                result = _a.sent();
                                response.send(result.recordset[0][0]);
                                return [3 /*break*/, 3];
                            case 2:
                                error_6 = _a.sent();
                                response.status(500);
                                response.json('error', { error: error_6 });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.get(/^((?!\.).)*$/, function (req, res) {
                    var path = "index.html";
                    res.sendfile(path, { root: "./apex/public" });
                });
                app.use(express.static("./apex/public"));
                /****************************
                 * BOT
                ********************/
                dialog.matches("None", [
                    function (session, args, next) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            session.endDialog("Acho que não entendi... vc pode pedir ajuda com 'help', 'ajuda', 'socorro' etc para obter a lista de comandos disponíveis");
                            return [2 /*return*/];
                        });
                    }); }
                ]);
                dialog.matches("Help", [
                    function (session, args, next) { return __awaiter(_this, void 0, void 0, function () {
                        var msg;
                        return __generator(this, function (_a) {
                            msg = "Atualmente eu posso apenas registrar momentos de vida kung fu para o diário. \n\n "
                                + "Você pode pedir algo como: \n\n"
                                + "* _\"Registrar um momento com o Andr\u00E9\"_ \n\n"
                                + "* _\"Informar sobre um almo\u00E7o com o Cris\"_ \n\n"
                                + "* _\"Gostaria de registrar uma refei\u00E7\u00E3o com o Cl\u00E1udio, a Alice e o Iuri\"_ \n\n"
                                + "* _\"Lan\u00E7ar um jantar com o Si Fu, Pereira, Pedro Oliveira e a Rubia\"_ \n\n\n\n"
                                + "Lembrando que se vc estiver preso em algum ponto pode usar o comando [cancelar] que eu recome\u00E7o a conversa ";
                            session.endDialog(msg);
                            return [2 /*return*/];
                        });
                    }); }
                ]);
                dialog.matches("Greetings", [
                    function (session, args, next) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            session.endDialog("Saudações!");
                            return [2 /*return*/];
                        });
                    }); }
                ]);
                dialog.matches("Thanks", [
                    function (session, args, next) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            session.endDialog("Disponha!");
                            return [2 /*return*/];
                        });
                    }); }
                ]);
                dialog.matches("RegisterMoment", [
                    function (session, args, next) { return __awaiter(_this, void 0, void 0, function () {
                        var title_entity, names_entities, moment;
                        return __generator(this, function (_a) {
                            title_entity = builder.EntityRecognizer.findEntity(args.entities, "title");
                            names_entities = builder.EntityRecognizer.findAllEntities(args.entities, "person_name");
                            moment = { title: "", people: [], fund_value: 0 };
                            moment.title = title_entity ? title_entity.entity : "Provimento de Vida Kung Fu";
                            session.dialogData.moment = moment;
                            session.beginDialog("/findParticipants", { moment: moment, names: names_entities.map(function (n) { return n.entity; }).join(",") });
                            return [2 /*return*/];
                        });
                    }); },
                    function (session, results, next) {
                        if (results.response.moment) {
                            session.dialogData.moment = results.response.moment;
                        }
                        var moment = session.dialogData.moment;
                        if (results.response.cancel) {
                            session.endDialog("Ok, cancelando essa operação então");
                            return;
                        }
                        session.beginDialog("/confirmMoment", { moment: moment });
                    }, function (session, results, next) { return __awaiter(_this, void 0, void 0, function () {
                        var moment, error_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (results.response.cancel) {
                                        session.endDialog("Ok, cancelando essa operação então");
                                        return [2 /*return*/];
                                    }
                                    if (results.response.moment
                                        && results.response.moment.dirty) {
                                        session.replaceDialog("/confirmMoment", {
                                            moment: results.response.moment
                                        });
                                        return [2 /*return*/];
                                    }
                                    moment = results.response.moment || session.dialogData.moment;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    session.sendTyping();
                                    return [4 /*yield*/, new sql.Request(pool_1)
                                            .input('participants', sql.VarChar(sql.MAX), moment.people.map(function (p) { return p.person_id; }).join(','))
                                            .input('fund_value', sql.Decimal(10, 2), moment.fund_value)
                                            .input('title', sql.VarChar(300), moment.title)
                                            .execute("RegisterMoment")];
                                case 2:
                                    _a.sent();
                                    session.endDialog("Evento registrado!");
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_7 = _a.sent();
                                    session.endDialog("Ocorreu um erro ao registrar o evento: " + error_7.message);
                                    return [2 /*return*/];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }
                ]);
                bot.dialog("/confirmMoment", [function (session, args, temp) {
                        if (args.cancel_all) {
                            session.endDialogWithResult({
                                response: { cancel: true }
                            });
                            return;
                        }
                        var moment = args.moment;
                        session.dialogData.moment = moment;
                        var msg = "Estou com os seguintes dados: \n\n"
                            + (" **T\u00EDtulo** : " + moment.title + " \n\n");
                        if (moment.people.length > 0) {
                            msg += getParticipationList(moment.people);
                        }
                        if (moment.fund_value > 0) {
                            msg += "\n\n **Valor para o fundo** : " + moment.fund_value + " ";
                        }
                        session.send(msg);
                        var fund_value_options = moment.fund_value > 0 ?
                            "Alterar valor para o fundo"
                            : "Adicionar valor para o fundo";
                        builder.Prompts.choice(session, "Posso confirmar? ", "Sim|Alterar|" + fund_value_options + "|Cancelar", { listStyle: builder.ListStyle.button });
                    }, function (session, results, next) {
                        var response = results.response;
                        if (response.index === 0) {
                            session.dialogData.moment.dirty = false;
                            session.endDialogWithResult({
                                response: session.dialogData.moment
                            });
                            return;
                        }
                        session.dialogData.moment.dirty = true;
                        if (response.index === 1) {
                            session.replaceDialog("/askChanges", { moment: session.dialogData.moment });
                            return;
                        }
                        if (response.index === 2) {
                            session.replaceDialog("/askFundValue", {
                                moment: session.dialogData.moment
                            });
                            return;
                        }
                        session.endDialogWithResult({
                            response: { cancel: true }
                        });
                    }]);
                bot.dialog("/askChanges", [function (session, args) {
                        session.dialogData.moment = args.moment;
                        builder.Prompts.choice(session, "O que deseja alterar?", "Título|Adicionar participante|Remover participante|Cancelar alterações|Cancelar lançamento", { listStyle: builder.ListStyle.button });
                    }, function (session, results, next) {
                        var response = results.response;
                        if (response.index === 0) {
                            session.replaceDialog("/changeTitle", {
                                moment: session.dialogData.moment
                            });
                            return;
                        }
                        if (response.index === 1) {
                            session.replaceDialog("/addParticipant", {
                                moment: session.dialogData.moment,
                            });
                            return;
                        }
                        if (response.index === 2) {
                            session.replaceDialog("/removeParticipant", {
                                moment: session.dialogData.moment
                            });
                            return;
                        }
                        if (response.index === 3) {
                            session.replaceDialog("/confirmMoment", {
                                moment: session.dialogData.moment
                            });
                            return;
                        }
                        session.replaceDialog("/confirmMoment", {
                            cancel_all: true
                        });
                    }]);
                bot.dialog("/addParticipant", [function (session, args) {
                        var moment = args.moment;
                        session.dialogData.moment = moment;
                        session.replaceDialog("/askNameAndSearchParticipant", {
                            moment: moment
                        });
                    }]);
                bot.dialog("/removeParticipant", [function (session, args) {
                        var moment = args.moment;
                        session.dialogData.moment = moment;
                        builder.Prompts.choice(session, "Quem deseja remover? ", moment.people.map(function (p) { return p.name; }), { listStyle: builder.ListStyle.button });
                    }, function (session, results, next) {
                        var name = results.response.entity;
                        var moment = session.dialogData.moment;
                        moment.people = moment.people
                            .filter(function (p) { return p.name != name; });
                        session.replaceDialog("/changeParticipants", { moment: moment });
                    }]);
                bot.dialog("/changeParticipants", [function (session, args) {
                        session.dialogData.moment = args.moment;
                        var moment = session.dialogData.moment;
                        var msg = "Então a lista ficou: \n\n";
                        if (moment.people.length > 0) {
                            msg += getParticipationList(moment.people);
                        }
                        builder.Prompts.choice(session, "O que deseja?", "Adicionar participantes|Remover participante|Continuar lan\u00E7amento", { listStyle: builder.ListStyle.button });
                    }, function (session, results, next) {
                        var response = results.response;
                        var moment = session.dialogData.moment;
                        if (response.index === 0) {
                            session.replaceDialog("/addParticipant", moment);
                            return;
                        }
                        if (response.index === 1) {
                            session.replaceDialog("/removeParticipant", { moment: moment });
                            return;
                        }
                        session.replaceDialog("/confirmMoment", {
                            moment: moment
                        });
                    }]);
                bot.dialog("/changeTitle", [function (session, args) {
                        session.dialogData.moment = args.moment;
                        builder.Prompts.text(session, "Poderia informar o título então?");
                    }, function (session, results, next) {
                        var moment = session.dialogData.moment;
                        moment.title = results.response;
                        session.replaceDialog("/confirmMoment", {
                            moment: moment
                        });
                    }]);
                bot.dialog("/askFundValue", [function (session, args) {
                        session.dialogData.moment = args.moment;
                        builder.Prompts.number(session, "Poderia informar o valor que será destinado para o fundo?");
                    }, function (session, results, next) {
                        var moment = session.dialogData.moment;
                        moment.fund_value = results.response;
                        session.replaceDialog("/confirmMoment", {
                            moment: moment
                        });
                    }]);
                bot.dialog("/askNameAndSearchParticipant", [function (session, args) {
                        session.dialogData.moment = args.moment;
                        builder.Prompts.text(session, "Poderia informar o nome então?");
                    }, function (session, results, next) {
                        session.replaceDialog("/findParticipants", {
                            names: results.response,
                            moment: session.dialogData.moment
                        });
                    }]);
                bot.dialog("/findParticipants", [function (session, args) { return __awaiter(_this, void 0, void 0, function () {
                        var names, result, error_8, not_founds, people, many_options, msg;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (args) {
                                        if (args.moment) {
                                            session.dialogData.moment = args.moment;
                                        }
                                        if (args.names) {
                                            session.dialogData.names = args.names;
                                        }
                                    }
                                    names = session.dialogData.names;
                                    if (!names || names.length == 0) {
                                        //session.replaceDialog("/askNameAndSearchParticipant", { moment: session.dialogData.moment });
                                        //return;
                                    }
                                    session.dialogData.query = [];
                                    if (!(names != null && names.length > 0)) return [3 /*break*/, 4];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    session.sendTyping();
                                    return [4 /*yield*/, new sql.Request(pool_1)
                                            .input('names', sql.VarChar(sql.MAX), names)
                                            .execute("GetPeopleByNameForBot")];
                                case 2:
                                    result = _a.sent();
                                    session.dialogData.query = result.recordset;
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_8 = _a.sent();
                                    session.endDialogWithResult({
                                        response: {
                                            error: "Ocorreu um erro ao obter os participantes: " + error_8.message
                                        }
                                    });
                                    return [2 /*return*/];
                                case 4:
                                    not_founds = session.dialogData.query.filter(function (f) { return !f.found; });
                                    people = session.dialogData.query.filter(function (f) { return f.found && f.total == 1; });
                                    many_options = session.dialogData.query.filter(function (f) { return f.found && f.total > 1; });
                                    if (!session.dialogData.moment.people) {
                                        session.dialogData.moment.people = [];
                                    }
                                    session.dialogData.moment.people = session.dialogData.
                                        moment.people.concat(people.filter(function (p) {
                                        return !session.dialogData.moment.people.find(function (p2) { return p2.person_id == p.person_id; });
                                    }));
                                    if (not_founds.length > 0) {
                                        msg = not_founds.length == 1 ?
                                            "não encontrei a seguinte pessoa: " + not_founds[0].name
                                            : "não encontrei as seguintes pessoas: " + not_founds.map(function (n) { return n.name; }).join(",");
                                        session.send(msg);
                                        //session.replaceDialog("/confirmMoment", {
                                        //    not_founds, moment: session.dialogData.moment
                                        //});                
                                    }
                                    if (many_options.length > 0) {
                                        session.replaceDialog("/choosePersonInList", {
                                            many_options: many_options, moment: session.dialogData.moment
                                        });
                                        return [2 /*return*/];
                                    }
                                    session.endDialogWithResult({
                                        response: { moment: session.dialogData.moment }
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); }]);
                bot.dialog("/choosePersonInList", [function (session, args) {
                        session.dialogData.moment = args.moment;
                        session.dialogData.current_options = args.many_options.shift();
                        session.dialogData.many_options = args.many_options;
                        if (!session.dialogData.current_options) {
                            session.endDialogWithResult({
                                response: { moment: session.dialogData.moment }
                            });
                            return;
                        }
                        var options = JSON.parse(session.dialogData.current_options.options);
                        options.push({ id: -1, name: "Ignorar esse nome" });
                        session.dialogData.options = options;
                        builder.Prompts.choice(session, "O nome '" + session.dialogData.current_options.name + "' possui algumas op\u00E7\u00F5es, qual seria?", options.map(function (p) { return p.name; }), { listStyle: builder.ListStyle.button });
                    }, function (session, result, next) {
                        var moment = session.dialogData.moment;
                        var many_options = session.dialogData.many_options;
                        var options = session.dialogData.options;
                        if (result.response.index === options.length) {
                            session.replaceDialog("/choosePersonInList", {
                                moment: moment, many_options: many_options
                            });
                            return;
                        }
                        moment.people.push(session.dialogData.options[result.response.index]);
                        session.replaceDialog("/choosePersonInList", {
                            moment: moment, many_options: many_options
                        });
                    }]);
                bot.dialog("/lookForNameOrCreate", [function (session, args) {
                        console.log("lookForNameOrCreate");
                    }]);
                port_1 = process.env.port || process.env.PORT || 3979;
                app.listen(port_1, function () {
                    console.log("server listening to " + port_1);
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=server.js.map