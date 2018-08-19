"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appInsights = require("applicationinsights");
const dependency_manager_1 = require("./src/services/managers/dependency-manager");
const data_runner_1 = require("./src/services/managers/data-runner");
const database_manager_1 = require("./src/services/managers/database-manager");
if (process.env.PRODUCTION !== "false") {
    // tslint:disable-next-line:no-var-requires
    require("dotenv").load();
}
else {
    appInsights.setup(process.env.AZURE_APP_INSIGHTS);
    appInsights.start();
}
require("reflect-metadata");
const errors_codes_1 = require("./src/helpers/errors-codes");
const old_routes = require("./src/initializers/old-routes");
const passport = require("./src/initializers/passport");
const routes = require("./src/initializers/routes");
const logger_service_1 = require("./src/services/logger-service");
process.on("unhandledRejection", (reason, p) => {
    const error = new Error("Unhandled Rejection");
    logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.UnhandledRejection, error, { reason, p });
});
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const container = dependency_manager_1.DependencyManager.container;
class ServerDataRunningConfiguration extends data_runner_1.DataRunningConfiguration {
    constructor() {
        super();
        this.shouldCommit = true;
        this.useTransaction = true;
    }
}
container.bind(database_manager_1.DatabaseManager).toSelf().inSingletonScope();
container.bind(ServerDataRunningConfiguration).to(data_runner_1.DataRunningConfiguration);
const app = express();
const port = process.env.port || process.env.PORT || 3979;
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
passport.initialize(app);
old_routes.initialize(app);
routes.initialize(app, "./src/routes");
app.get(/^((?!\.).)*$/, (req, res) => {
    const path = "index.html";
    res.sendfile(path, { root: "./apex/public" });
});
app.use(express.static("./apex/public"));
app.listen(port, () => {
    logger_service_1.LoggerService.info(logger_service_1.LogOrigins.General, `server listening to ${port}`);
});
//# sourceMappingURL=server.js.map