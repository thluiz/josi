if (process.env.LOAD_ENV === 'true') {
    require('dotenv').load();
}

import "reflect-metadata";
import { DatabaseFacility } from './src/facilities/database-facility';
import { SecurityService } from './domain/services/security_services';
import * as old_routes from './src/initializers/old-routes';
import * as passport  from './src/initializers/passport';
import * as routes  from './src/initializers/routes';

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

    app.listen(port, function () {
        console.log(`server listening to ${port}`); 
    });
});

