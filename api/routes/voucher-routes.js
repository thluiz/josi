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
const sql = require("mssql");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    app.post("/api/voucher", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(200), req.body.name)
                .input('email', sql.VarChar(100), req.body.email)
                .input('cpf', sql.VarChar(11), req.body.cpf)
                .input('phone', sql.VarChar(100), req.body.phone)
                .input('socialLinks', sql.VarChar(100), req.body.socialLinks)
                .input('branch_id', sql.Int, req.body.unit)
                .input('voucher_id', sql.Int, req.body.voucher_id || 1)
                .input('additionalAnswer', sql.VarChar(sql.MAX), req.body.additionalAnswer || '')
                .input('invite_key', sql.VarChar(60), req.body.invite)
                .input('branch_map_id', sql.Int, req.body.schedule)
                .execute(`CreatePersonFromVoucher`);
        }
        catch (error) {
            console.log(error);
        }
        res.send({ sucess: true });
    }));
    app.get("/api/voucher/invites", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetInvitesForVoucher`);
        let response = result.recordset[0];
        res.send(response);
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=voucher-routes.js.map