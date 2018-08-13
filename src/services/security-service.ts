import { UsersRepository } from './../repositories/users-repository';
import { User } from "../entity/User";
import { DatabaseManager } from "./managers/database-manager";
import { DependencyManager } from "./managers/dependency-manager";

export enum Permissions {
    Operator,
    Manager,
    Director
}

export class SecurityService {
    private DBM = DependencyManager.container.resolve(DatabaseManager);
    private UR = new UsersRepository();

    async serializeUser(user: User): Promise<any> {

        if (user == null) {
            return null;
        }

        await user.loadPersonIfNeeded();

        const response: any = {
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
    }

    async getUserFromRequest(req): Promise<User> {
        if (process.env.PRODUCTION === "false") {

            const loadUser = await this.UR.getUserByToken(process.env.TOKEN_USER_DEV);

            return loadUser.data as User;
        }

        return req.user;
    }

    async checkUserHasPermission(user: User, permission: Permissions): Promise<boolean> {
        if (user == null || permission == null) {
            return false;
        }

        let hasPermission = false;

        switch (permission) {
            case (Permissions.Operator):
                hasPermission = (await user.is_operator() || await user.is_director() || await user.is_manager());
                break;
            case (Permissions.Manager):
                hasPermission = (await user.is_director() || await user.is_manager());
                break;
            case (Permissions.Director):
                hasPermission = (await user.is_director());
                break;
        }

        return hasPermission;
    }

    async findUser(email, callback) {
        const loadUser = await this.UR.getUserByEmail(email);
        const user = loadUser.data;

        if (!user) {
            callback(null, false);
            return;
        }

        callback(null, user);
    }

    async findUserByToken(token, callback?) {
        const loadUser = await this.UR.getUserByToken(token);
        const user = loadUser.data;

        if (!user) {
            if (callback) { callback("user not fount", false); }
            return;
        }

        if (callback) { callback(null, user); }

        return user;
    }
}
