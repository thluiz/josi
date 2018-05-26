"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.LOAD_ENV === 'true') {
    require('dotenv').load();
}
require("reflect-metadata");
const security_services_1 = require("./domain/services/security_services");
const old_routes = require("./src/initializers/old-routes");
const passport = require("./src/initializers/passport");
const routes = require("./src/initializers/routes");
const express = require('express');
const helmet = require('helmet');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.port || process.env.PORT || 3979;
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
security_services_1.SecurityService.create_pool().then((pool) => {
    passport.initialize(app);
    old_routes.initialize(app, pool);
    routes.initialize(app, "./src/routes");
    app.get(/^((?!\.).)*$/, (req, res) => {
        var path = "index.html";
        res.sendfile(path, { root: "./apex/public" });
    });
    app.use(express.static("./apex/public"));
    app.listen(port, () => {
        console.log(`server listening to ${port}`);
    });
});
//# sourceMappingURL=server.js.map