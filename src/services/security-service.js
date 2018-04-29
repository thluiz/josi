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
const database_facility_1 = require("./../facilities/database-facility");
const User_1 = require("../entity/User");
var Permissions;
(function (Permissions) {
    Permissions[Permissions["Operator"] = 0] = "Operator";
    Permissions[Permissions["Manager"] = 1] = "Manager";
    Permissions[Permissions["Director"] = 2] = "Director";
})(Permissions = exports.Permissions || (exports.Permissions = {}));
class SecurityService {
    static serializeUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.person || !user.person.default_page) {
                const UR = yield database_facility_1.DatabaseFacility.getRepository(User_1.User);
                user = yield UR.findOne({ id: user.id }, { relations: ["person", "person.default_page"] });
            }
            return {
                name: user.person.name,
                is_director: user.is_director,
                is_manager: user.is_manager,
                is_operator: user.is_operator,
                avatar_img: user.person.avatar_img,
                person_id: user.person.id[0],
                email: user.email,
                token: user.token,
                default_page_id: user.person.default_page.id[0],
                default_page: user.person.default_page.name,
                default_page_url: user.person.default_page.url
            };
        });
    }
    static getUserFromRequest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            /*if (process.env.LOAD_ENV === 'true') {
                const UR = await DatabaseFacility.getRepository<User>(User);
                const user = await UR.findOne({ token: process.env.TOKEN_USER_DEV },
                    { relations: [ "person", "person.default_page" ] }
                );
    
                return user;
            }*/
            return req.user;
        });
    }
    static checkUserHasPermission(user, permission) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null || permission == null)
                return false;
            let has_permission = false;
            switch (permission) {
                case (Permissions.Operator):
                    has_permission = user.is_operator() || user.is_director() || user.is_manager();
                    break;
                case (Permissions.Manager):
                    has_permission = user.is_director() || user.is_manager();
                    break;
                case (Permissions.Director):
                    has_permission = user.is_director();
                    break;
            }
            return has_permission;
        });
    }
}
exports.SecurityService = SecurityService;
//# sourceMappingURL=security-service.js.map