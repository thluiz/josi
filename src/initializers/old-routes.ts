import { FirebaseService } from './../services/firebase-service';
import { DatabaseFacility } from './../facilities/database-facility';
import * as sql from 'mssql';
import * as OldSecurityService from "../../domain/services/security_services";
import { Permissions, SecurityService } from '../services/security-service';
import * as auth from '../middlewares/auth';

import * as people_routes from "../../api/routes/people-routes";
import * as parameters_routes from "../../api/routes/parameters-routes";
import * as incidents_routes from "../../api/routes/incidents-routes";
import * as cards_routes from "../../api/routes/cards-routes";
import * as financial_routes from "../../api/routes/financial-routes";
import * as voucher_routes from "../../api/routes/voucher-routes";
import * as bot from './bot';


export function initialize(app, pool) {
    const bot_connector = bot.initialize();

    app.post("/api/messages", bot_connector.listen());

    people_routes.configure_routes(app, pool);
    parameters_routes.configure_routes(app, pool);
    incidents_routes.configure_routes(app, pool);
    cards_routes.configure_routes(app, pool);
    financial_routes.configure_routes(app, pool);
    voucher_routes.configure_routes(app, pool);
        
    app.get("/api/daily/:branch?/:display?/:display_modifier?",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            try {                                         
                let result = await DatabaseFacility.ExecuteJsonSP("GetDailyMonitor", 
                    { "branch": request.params.branch > 0 ? request.params.branch : null },
                    { "display_modifier":  request.params.display_modifier || 0 },
                    { "display": request.params.display || 0 }
                );                    


                response.send(result.data);
            } catch (error) {
                response.status(500);
                response.json({ error: error });
            }
        });

    app.get("/api/people_summary/:branch?/:week?",
        auth.ensureLoggedIn(),
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
        auth.ensureLoggedIn(),
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
}