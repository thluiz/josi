"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.initialize = initialize;
//# sourceMappingURL=old-routes.js.map