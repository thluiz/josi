import { DatabaseManager } from './../services/managers/database-manager';

after(function (done) {
    let DBM = new DatabaseManager();
    DBM.CloseConnection().then(done);
});