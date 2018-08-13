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
            const DBM = DependencyManager.container.resolve(DatabaseManager);
            const connection = await DBM.getConnection();

            const user = await connection.manager
            .createQueryBuilder(User, "user")
            .where("user.token = :token", { token: process.env.TOKEN_USER_DEV })
            .cache(30000)
            .getOne();

            return user;
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
        const connection = await this.DBM.getConnection();

        const user = await connection.manager
        .createQueryBuilder(User, "user")
        .where("user.email = :email", { email })
        .cache(30000)
        .getOne();

        if (!user) {
            callback(null, false);
            return;
        }

        callback(null, user);
    }

    async findUserByToken(token, callback?) {
        const connection = await this.DBM.getConnection();

        const user = await connection.manager
        .createQueryBuilder(User, "user")
        .where("user.email = :token", { token })
        .cache(30000)
        .getOne();

        if (!user) {
            if (callback) { callback("user not fount", false); }
            return;
        }

        if (callback) { callback(null, user); }

        return user;
    }
}
