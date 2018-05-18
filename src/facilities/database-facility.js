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
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const await_to_js_1 = require("await-to-js");
const result_1 = require("../helpers/result");
const errors_codes_1 = require("../helpers/errors-codes");
class DatabaseFacility {
    static getRepository(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getConnection();
            return yield connection.getRepository(type);
        });
    }
    static ExecuteWithinTransaction(fun) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield DatabaseFacility.getConnection();
            const queryRunner = conn.createQueryRunner();
            try {
                yield queryRunner.startTransaction();
                let result = yield fun(queryRunner);
                yield queryRunner.commitTransaction();
                return result;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    static ExecuteSPNoResults(procedure, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let [conn_error, connection] = yield await_to_js_1.default(this.getConnection());
            if (conn_error)
                return result_1.Result.Fail(errors_codes_1.ErrorCode.FailedGetConnection, conn_error);
            let { query, values } = this.buildSPParameters(procedure, parameters);
            let [err, result] = yield await_to_js_1.default(connection.query(query, values));
            if (err)
                return result_1.Result.Fail(errors_codes_1.ErrorCode.GenericError, err);
            return result_1.Result.Ok();
        });
    }
    static ExecuteJsonSP(procedure, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getConnection();
            let { query, values } = this.buildSPParameters(procedure, parameters);
            const result = yield connection.query(query, values);
            return JSON.parse(result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]);
        });
    }
    static buildSPParameters(procedure, parameters) {
        let values = [];
        let query = `exec ${procedure} `;
        if (parameters != null) {
            query += parameters.map((p, i) => {
                return `@${Object.keys(p)[0]} = @${i}`;
            }).join(", ");
            parameters.map((p) => p[Object.keys(p)[0]])
                .forEach(p => values.push(p));
        }
        return { query, values };
    }
    static getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._connection) {
                this._connection = yield typeorm_1.createConnection({
                    type: 'mssql',
                    host: process.env.SQL_HOST,
                    username: process.env.SQL_DATABASE,
                    password: process.env.SQL_PASSWORD,
                    database: process.env.SQL_DATABASE,
                    extra: { options: { encrypt: true } },
                    logging: true,
                    synchronize: false,
                    entities: [
                        "src/entity/*.js"
                    ],
                    subscribers: [
                        "src/subscriber/*.js"
                    ],
                    migrations: [
                        "src/migration/*.js"
                    ],
                    cli: {
                        entitiesDir: "entity",
                        migrationsDir: "migration",
                        subscribersDir: "subscriber"
                    }
                });
            }
            return this._connection;
        });
    }
}
exports.DatabaseFacility = DatabaseFacility;
//# sourceMappingURL=database-facility.js.map