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
var Permissions;
(function (Permissions) {
    Permissions[Permissions["Operator"] = 0] = "Operator";
    Permissions[Permissions["Manager"] = 1] = "Manager";
    Permissions[Permissions["Director"] = 2] = "Director";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
class User {
}
exports.User = User;
class SecurityService {
    static get_config() {
        if (process.env.LOAD_ENV === 'true') {
            require('dotenv').load();
        }
        return {
            database: process.env.SQL_DATABASE,
            options: {
                // use this if you're on Windows Azure
                encrypt: true,
            },
            // needed to parse the procedure result, the typescript anotation, in this case, is wrong.
            parseJSON: true,
            password: process.env.SQL_PASSWORD,
            server: process.env.SQL_HOST,
            user: process.env.SQL_USER,
        };
    }
    static create_pool() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = new sql.ConnectionPool(this.get_config());
            pool.on('error', err => {
                console.log(err);
            });
            yield pool.connect();
            return pool;
        });
    }
    static findUser(email, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let pool = yield this.create_pool();
            let result = yield new sql.Request(pool)
                .input("email", sql.VarChar(250), email)
                .query("select * from [user] where email = @email");
            if (result.rowsAffected != 1) {
                callback(null, false);
                return;
            }
            const user = result.recordset[0];
            callback(null, user);
        });
    }
    static findUserByToken(token, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let pool = yield this.create_pool();
            let result = yield new sql.Request(pool)
                .input("token", sql.UniqueIdentifier, token)
                .query("select * from [vwUser] where token = @token");
            if (result.rowsAffected != 1) {
                console.log("user not found");
                if (callback)
                    callback("user not fount", false);
                return;
            }
            const user = result.recordset[0];
            if (callback)
                callback(null, user);
            return user;
        });
    }
    static ensureLoggedIn() {
        return function (req, res, next) {
            // isAuthenticated is set by `deserializeUser()`
            if (process.env.LOAD_ENV === 'true') {
                next();
                return;
            }
            if (!req.isAuthenticated || !req.isAuthenticated()) {
                res.status(401).json({
                    success: false,
                    message: 'You need to be authenticated to access this page!'
                });
            }
            else {
                next();
            }
        };
    }
    static ensureHasPermission(permission) {
        return function (req, res, next) {
            const userReq = SecurityService.getUserFromRequest(req);
            userReq.then((user) => {
                let has_permission = false;
                if (user) {
                    switch (permission) {
                        case (Permissions.Operator):
                            has_permission = user.is_operator || user.is_director || user.is_manager;
                            break;
                        case (Permissions.Manager):
                            has_permission = user.is_director || user.is_manager;
                            break;
                        case (Permissions.Director):
                            has_permission = user.is_director;
                            break;
                    }
                }
                if (!has_permission) {
                    res.status(403).json({
                        success: false,
                        message: 'You don´t have the necessary permitions for this action!'
                    });
                    return;
                }
                next();
            }).catch((error) => {
                console.log(error);
                res.status(503).json({
                    success: false,
                    message: 'sorry! something went wrong...'
                });
                return;
            });
        };
    }
    static getUserFromRequest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.LOAD_ENV === 'true') {
                let user = this.findUserByToken(process.env.TOKEN_USER_DEV, () => { });
                return user;
            }
            return req.user;
        });
    }
}
exports.SecurityService = SecurityService;
//# sourceMappingURL=security_services.js.map