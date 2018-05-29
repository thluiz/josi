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
const database_facility_1 = require("./../facilities/database-facility");
const sql = require("mssql");
const auth = require("../middlewares/auth");
const people_routes = require("../../api/routes/people-routes");
const parameters_routes = require("../../api/routes/parameters-routes");
const incidents_routes = require("../../api/routes/incidents-routes");
const cards_routes = require("../../api/routes/cards-routes");
const financial_routes = require("../../api/routes/financial-routes");
const voucher_routes = require("../../api/routes/voucher-routes");
const bot = require("./bot");
function initialize(app, pool) {
    const bot_connector = bot.initialize();
    app.post("/api/messages", bot_connector.listen());
    people_routes.configure_routes(app, pool);
    parameters_routes.configure_routes(app, pool);
    incidents_routes.configure_routes(app, pool);
    cards_routes.configure_routes(app, pool);
    financial_routes.configure_routes(app, pool);
    voucher_routes.configure_routes(app, pool);
    app.get("/api/daily/:branch?/:display?/:display_modifier?", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield database_facility_1.DatabaseFacility.ExecuteJsonSP("GetDailyMonitor", { "branch": request.params.branch > 0 ? request.params.branch : null }, { "display_modifier": request.params.display_modifier || 0 }, { "display": request.params.display || 0 });
            response.send(result.data);
        }
        catch (error) {
            response.status(500);
            response.json({ error: error });
        }
    }));
    app.get("/api/people_summary/:branch?/:week?", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield new sql.Request(pool)
                .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                .input('week_modifier', sql.Int, request.params.week || 0)
                .input('date', sql.VarChar(10), request.params.date)
                .execute(`GetPeopleSummary`);
            response.send((result.recordset[0]));
        }
        catch (error) {
            response.status(500);
            response.json({ error: error });
        }
    }));
    app.get("/api/sumary/:branch?/:month?/:week?/:date?", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield new sql.Request(pool)
                .input('branch', sql.Int, request.params.branch > 0 ? request.params.branch : null)
                .input('month_modifier', sql.Int, request.params.month || 0)
                .input('week_modifier', sql.Int, request.params.week || 0)
                .input('date', sql.VarChar(10), request.params.date)
                .execute(`GetSumary`);
            response.send(result.recordset[0][0]);
        }
        catch (error) {
            response.status(500);
            response.json('error', { error: error });
        }
    }));
}
exports.initialize = initialize;
//# sourceMappingURL=old-routes.js.map