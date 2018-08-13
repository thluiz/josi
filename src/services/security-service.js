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
const User_1 = require("../entity/User");
const database_manager_1 = require("./managers/database-manager");
const dependency_manager_1 = require("./managers/dependency-manager");
var Permissions;
(function (Permissions) {
    Permissions[Permissions["Operator"] = 0] = "Operator";
    Permissions[Permissions["Manager"] = 1] = "Manager";
    Permissions[Permissions["Director"] = 2] = "Director";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
class SecurityService {
    constructor() {
        this.DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    }
    serializeUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                return null;
            }
            yield user.loadPersonIfNeeded();
            const response = {
                name: user.person.name,
                is_director: user.is_director,
                is_manager: user.is_manager,
                is_operator: user.is_operator,
                avatar_img: user.person.avatar_img,
                person_id: user.person.id,
                email: user.email,
                token: user.token,
                default_branch_id: user.default_branch_id
            };
            if (user.person.default_page != null) {
                response.default_page_id = user.person.default_page.id[0];
                response.default_page = user.person.default_page.name;
                response.default_page_url = user.person.default_page.url;
            }
            return response;
        });
    }
    getUserFromRequest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.PRODUCTION === "false") {
                const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
                const connection = yield DBM.getConnection();
                const user = yield connection.manager
                    .createQueryBuilder(User_1.User, "user")
                    .where("user.token = :token", { token: process.env.TOKEN_USER_DEV })
                    .cache(30000)
                    .getOne();
                return user;
            }
            return req.user;
        });
    }
    checkUserHasPermission(user, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null || permission == null) {
                return false;
            }
            let hasPermission = false;
            switch (permission) {
                case (Permissions.Operator):
                    hasPermission = ((yield user.is_operator()) || (yield user.is_director()) || (yield user.is_manager()));
                    break;
                case (Permissions.Manager):
                    hasPermission = ((yield user.is_director()) || (yield user.is_manager()));
                    break;
                case (Permissions.Director):
                    hasPermission = (yield user.is_director());
                    break;
            }
            return hasPermission;
        });
    }
    findUser(email, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.DBM.getConnection();
            const user = yield connection.manager
                .createQueryBuilder(User_1.User, "user")
                .where("user.email = :email", { email })
                .cache(30000)
                .getOne();
            if (!user) {
                callback(null, false);
                return;
            }
            callback(null, user);
        });
    }
    findUserByToken(token, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.DBM.getConnection();
            const user = yield connection.manager
                .createQueryBuilder(User_1.User, "user")
                .where("user.email = :token", { token })
                .cache(30000)
                .getOne();
            if (!user) {
                if (callback) {
                    callback("user not fount", false);
                }
                return;
            }
            if (callback) {
                callback(null, user);
            }
            return user;
        });
    }
}
exports.SecurityService = SecurityService;
//# sourceMappingURL=security-service.js.map