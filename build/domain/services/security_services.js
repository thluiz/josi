"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sql = require('mssql');
var Permissions;
(function (Permissions) {
    Permissions[Permissions["Operator"] = 0] = "Operator";
    Permissions[Permissions["Manager"] = 1] = "Manager";
    Permissions[Permissions["Director"] = 2] = "Director";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
exports.User = User;
var SecurityService = /** @class */ (function () {
    function SecurityService() {
    }
    SecurityService.get_config = function () {
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
            requestTimeout: 60000
        };
    };
    SecurityService.create_pool = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pool = new sql.ConnectionPool(this.get_config());
                        pool.on('error', function (err) {
                            console.log(err);
                        });
                        return [4 /*yield*/, pool.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, pool];
                }
            });
        });
    };
    SecurityService.findUser = function (email, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var pool, result, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.create_pool()];
                    case 1:
                        pool = _a.sent();
                        return [4 /*yield*/, new sql.Request(pool)
                                .input("email", sql.VarChar(250), email)
                                .query("select * from [user] where email = @email")];
                    case 2:
                        result = _a.sent();
                        if (result.rowsAffected != 1) {
                            callback(null, false);
                            return [2 /*return*/];
                        }
                        user = result.recordset[0];
                        callback(null, user);
                        return [2 /*return*/];
                }
            });
        });
    };
    SecurityService.findUserByToken = function (token, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var pool, result, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.create_pool()];
                    case 1:
                        pool = _a.sent();
                        return [4 /*yield*/, new sql.Request(pool)
                                .input("token", sql.UniqueIdentifier, token)
                                .query("select * from [vwUser] where token = @token")];
                    case 2:
                        result = _a.sent();
                        if (result.rowsAffected != 1) {
                            console.log("user not found");
                            if (callback)
                                callback("user not fount", false);
                            return [2 /*return*/];
                        }
                        user = result.recordset[0];
                        if (callback)
                            callback(null, user);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    SecurityService.ensureLoggedIn = function () {
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
    };
    SecurityService.ensureHasPermission = function (permission) {
        return function (req, res, next) {
            var userReq = SecurityService.getUserFromRequest(req);
            userReq.then(function (user) {
                var has_permission = false;
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
            }).catch(function (error) {
                console.log(error);
                res.status(503).json({
                    success: false,
                    message: 'sorry! something went wrong...'
                });
                return;
            });
        };
    };
    SecurityService.getUserFromRequest = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                if (process.env.LOAD_ENV === 'true') {
                    user = this.findUserByToken(process.env.TOKEN_USER_DEV, function () { });
                    return [2 /*return*/, user];
                }
                return [2 /*return*/, req.user];
            });
        });
    };
    return SecurityService;
}());
exports.SecurityService = SecurityService;
//# sourceMappingURL=security_services.js.map