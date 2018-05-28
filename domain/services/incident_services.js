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
const sql = require('mssql');
class IncidentService {
    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }
    save_comment(incident_id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('incident_id', sql.Int, incident_id)
                .input('comment', sql.NVarChar(sql.MAX), comment)
                .execute(`SaveIncidentComment`);
            return result;
        });
    }
    archive_comment(comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new sql.Request(this.sql_pool)
                .input('comment_id', sql.Int, comment_id)
                .execute(`TogleIncidentCommentArchived`);
            return result;
        });
    }
}
exports.IncidentService = IncidentService;
//# sourceMappingURL=incident_services.js.map