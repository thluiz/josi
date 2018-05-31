if (process.env.LOAD_ENV === 'true') {
    require('dotenv').load();
}

import { LoggerService, ErrorOrigins } from './src/services/logger-service';
import "reflect-metadata";
import { DatabaseFacility } from './src/facilities/database-facility';
import { SecurityService } from './domain/services/security_services';
import * as old_routes from './src/initializers/old-routes';
import * as passport  from './src/initializers/passport';
import * as routes  from './src/initializers/routes';

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    let error = new Error('Unhandled Rejection');
    LoggerService.error(ErrorOrigins.UnhandledRejection, error, { reason, p});
});

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

SecurityService.create_pool().then((pool) => {
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
