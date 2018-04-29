import { DatabaseFacility } from './../facilities/database-facility';
import { User } from '../entity/User';

export enum Permissions {
    Operator,
    Manager,
    Director
}

export class SecurityService {
    
    static async serializeUser(user: User) : Promise<any> {
        if(!user.person || !user.person.default_page) {
            const UR = await DatabaseFacility.getRepository<User>(User);
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
            default_page_id: user.person.default_page.id[0],
            default_page: user.person.default_page.name,
            default_page_url: user.person.default_page.url
        };
    }

    static async getUserFromRequest(req): Promise<User> {
        /*if (process.env.LOAD_ENV === 'true') {
            const UR = await DatabaseFacility.getRepository<User>(User);
            const user = await UR.findOne({ token: process.env.TOKEN_USER_DEV },
                { relations: [ "person", "person.default_page" ] }
            );

            return user;
        }*/

        return req.user;
    }

    static async checkUserHasPermission(user: User, permission: Permissions): Promise<boolean> {
        if(user == null || permission == null)
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
    }
}