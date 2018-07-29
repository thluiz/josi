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
const database_manager_1 = require("./managers/database-manager");
class BaseService {
    constructor(_databaseManager, _dataRunner) {
        this._databaseManager = _databaseManager;
        this._dataRunner = _dataRunner;
    }
    get databaseManager() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (!this._databaseManager) {
                this._databaseManager = new database_manager_1.DatabaseManager();
            }
            return this._databaseManager;
        }))();
    }
    get dataRunner() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            if (this._dataRunner) {
                return this._dataRunner;
            }
            let conn = yield (yield this.databaseManager).getConnection();
            this._dataRunner = {
                runner: yield conn.createQueryRunner(),
                shouldCommit: true
            };
            return this._dataRunner;
        }))();
    }
    get queryRunner() {
        return (() => __awaiter(this, void 0, void 0, function* () {
            return (yield this.dataRunner).runner;
        }))();
    }
    getRepository(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.queryRunner).connection.getRepository(type);
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.queryRunner).manager.save(entity);
        });
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base-service.js.map