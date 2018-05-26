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
const auth = require("../../../src/middlewares/auth");
const database_facility_1 = require("../../facilities/database-facility");
function routes(app) {
    app.get("/api/branches/:id?", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = !req.params.id ?
                yield database_facility_1.DatabaseFacility.ExecuteJsonSP(`GetBranches`)
                : yield database_facility_1.DatabaseFacility.ExecuteJsonSQL(`select * from vwBranch where id = @0 for json path`, [req.params.id]);
            res.send(result);
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }));
}
exports.routes = routes;
//# sourceMappingURL=branches-routes.js.map