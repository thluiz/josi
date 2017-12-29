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
class PersonService {
    constructor(sql_pool) {
        this.sql_pool = sql_pool;
    }
    add_role(person_id, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sql_pool
                .request()
                .input('person_id', sql.Int, person_id)
                .input('role_id', sql.Int, role_id)
                .execute(`AddPersonRole`);
            return result;
        });
    }
    remove_role(person_id, role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sql_pool
                .request()
                .input('person_id', sql.Int, person_id)
                .input('role_id', sql.Int, role_id)
                .execute(`RemovePersonRole`);
            return result;
        });
    }
    change_kf_name(person_id, kf_name, ideograms) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.sql_pool
                .request()
                .input('person_id', sql.Int, person_id)
                .input('alias', sql.VarChar(150), kf_name)
                .input('kf_name', sql.Bit, 1)
                .input('ideograms', sql.NVarChar(100), ideograms)
                .execute(`AddAlias`);
            return result;
        });
    }
    update_person_data(person) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.sql_pool
                .request()
                .input('id', sql.Int, person.id)
                .input('name', sql.VarChar(200), person.name)
                .input('birth_date', sql.VarChar(10), person.birth_date)
                .input('admission_date', sql.VarChar(10), person.admission_date)
                .input('baaisi_date', sql.VarChar(10), person.baaisi_date)
                .input('kf_name', sql.VarChar(200), person.kf_name)
                .input('kf_name_ideograms', sql.NVarChar(200), person.kf_name_ideograms)
                .execute(`UpdatePersonData`);
        });
    }
}
exports.PersonService = PersonService;
//# sourceMappingURL=person_services.js.map