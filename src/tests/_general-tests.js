"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load();
const database_manager_1 = require("./../services/managers/database-manager");
after(function (done) {
    let DBM = new database_manager_1.DatabaseManager();
    DBM.CloseConnection().then(done);
});
//# sourceMappingURL=_general-tests.js.map