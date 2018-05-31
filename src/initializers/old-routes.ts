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
}