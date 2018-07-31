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
const result_1 = require("../../helpers/result");
const errors_codes_1 = require("../../helpers/errors-codes");
let connection = null;
function getGlobalConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connection) {
            connection = yield typeorm_1.createConnection({
                type: 'mssql',
                host: process.env.SQL_HOST,
                username: process.env.SQL_USER,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DATABASE,
                extra: { options: { encrypt: true } },
                logging: process.env.SQL_SHOW_LOGGING === "true",
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
        return connection;
    });
}
class DatabaseManager {
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return getGlobalConnection();
        });
    }
    getRepository(type, runner) {
        return __awaiter(this, void 0, void 0, function* () {
            let manager = yield (runner ? runner.manager : (yield getGlobalConnection()).manager);
            return yield manager.getRepository(type);
        });
    }
    CreateQueryRunner() {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield getGlobalConnection();
            const queryRunner = conn.createQueryRunner();
            if (!queryRunner.connection.isConnected) {
                yield queryRunner.connection.connect();
            }
            return queryRunner;
        });
    }
    StartTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.startTransaction();
            return queryRunner;
        });
    }
    CommitTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            queryRunner.commitTransaction();
        });
    }
    RollbackTransaction(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            queryRunner.rollbackTransaction();
        });
    }
    ExecuteWithinTransaction(fun, queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            if (queryRunner) {
                return fun(queryRunner);
            }
            const conn = yield getGlobalConnection();
            queryRunner = conn.createQueryRunner();
            try {
                yield queryRunner.startTransaction();
                let result = yield fun(queryRunner);
                yield queryRunner.commitTransaction();
                return result;
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    ExecuteSPNoResults(procedure, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let [conn_error, connection] = yield await_to_js_1.default(getGlobalConnection());
            if (conn_error)
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.FailedGetConnection, conn_error);
            let { query, values } = this.buildSPParameters(procedure, parameters);
            let [err, _] = yield await_to_js_1.default(connection.query(query, values));
            if (err)
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, err);
            return result_1.SuccessResult.GeneralOk();
        });
    }
    ExecuteJsonSQL(sql, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let connection = yield getGlobalConnection();
                const result = yield connection.query(sql, parameters);
                return result_1.SuccessResult.GeneralOk(JSON.parse(result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]));
            }
            catch (error) {
                if (error instanceof SyntaxError && error.message.indexOf("Unexpected end of JSON input") >= 0) {
                    return result_1.SuccessResult.GeneralOk({});
                }
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    ExecuteTypedJsonSP(result_type, procedure, parameters, runner) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ExecuteSP(result_type, procedure, true, parameters, runner);
        });
    }
    ExecuteJsonSP(procedure, ...parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ExecuteSP("GENERIC_ACTION", procedure, true, parameters);
        });
    }
    CloseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            let conn = yield getGlobalConnection();
            conn.close();
        });
    }
    ExecuteSP(result_type, procedure, parseResults, parameters, data_runner) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!data_runner) {
                    data_runner = {
                        runner: yield this.CreateQueryRunner(),
                        useTransaction: false,
                        shouldCommit: false
                    };
                }
                let { query, values } = this.buildSPParameters(procedure, parameters);
                const result = yield data_runner.runner.manager.query(query, values);
                const data = result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
                if (data_runner.shouldCommit && data_runner.runner.isTransactionActive)
                    yield data_runner.runner.commitTransaction();
                return parseResults ?
                    result_1.SuccessResult.Ok(result_type, JSON.parse(data)) : result_1.SuccessResult.Ok(data);
            }
            catch (error) {
                if (error instanceof SyntaxError && error.message.indexOf("Unexpected end of JSON input") >= 0) {
                    if (data_runner.shouldCommit && data_runner.runner.isTransactionActive)
                        yield data_runner.runner.commitTransaction();
                    return result_1.SuccessResult.Ok(result_type, new Array());
                }
                if (data_runner.shouldCommit && data_runner.runner.isTransactionActive)
                    yield data_runner.runner.rollbackTransaction();
                return result_1.ErrorResult.Fail(errors_codes_1.ErrorCode.GenericError, error);
            }
        });
    }
    buildSPParameters(procedure, parameters) {
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
}
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=database-manager.js.map