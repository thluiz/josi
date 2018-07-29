import { DatabaseManager } from './managers/database-manager';
import { User } from '../entity/User';

const DBM = new DatabaseManager();

export enum Permissions {
    Operator,
    Manager,
    Director
}

export class SecurityService {

    static async serializeUser(user: User) : Promise<any> {
        if(user == null)
            return null;

        if(!user.person || !user.person.default_page) {
            const UR = await DBM.getRepository<User>(User);
            user = await UR.findOne(
                { id: user.id },
                { relations: [ "person", "person.default_page" ] }
            );
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
            default_branch_id: user.default_branch_id,
            default_page_id: user.person.default_page.id[0],
            default_page: user.person.default_page.name,
            default_page_url: user.person.default_page.url
        };
    }

    static async getUserFromRequest(req): Promise<User> {
        if (process.env.LOAD_ENV === 'true') {
            const connection = await DBM.getConnection();

            const user = await connection
            .createQueryBuilder(User, "user")
            .where("user.token = :token", { token: process.env.TOKEN_USER_DEV })
            .cache(3000)
            .getOne();

            return user;
        }

        return req.user;
    }

    static async checkUserHasPermission(user: User, permission: Permissions): Promise<boolean> {
        if(user == null || permission == null)
            return false;

        let has_permission = false;

        switch (permission) {
            case (Permissions.Operator):
                has_permission = (await user.is_operator() || await user.is_director() || await user.is_manager());
                break;
            case (Permissions.Manager):
                has_permission = (await user.is_director() || await user.is_manager());
                break;
            case (Permissions.Director):
                has_permission = (await user.is_director());
                break;
        }

        return has_permission;
    }
}