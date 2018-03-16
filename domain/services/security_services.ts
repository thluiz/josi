const sql = require('mssql')

export enum Permissions {
    Operator,
    Manager,
    Director
}

export class User{ 
    id: number; 
    person_id: number;
    email: string; 
    name:string; 
    avatar_img: string;
    is_operator:boolean; 
    is_manager:boolean;
    is_director:boolean;
    is_disciple:boolean;    
}

export class SecurityService {    
    private static get_config () {
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
    }

    static async create_pool() {        
        const pool = new sql.ConnectionPool(this.get_config());    

        pool.on('error', err => {
            console.log(err);
        })

        await pool.connect();
        
        return pool;
    }

    static async findUser(email, callback) {
        let pool = await this.create_pool();
        let result = await new sql.Request(pool)
                            .input("email", sql.VarChar(250), email)
                            .query("select * from [user] where email = @email");

        if(result.rowsAffected != 1) {
            callback(null, false);
            return;
        } 

        const user = result.recordset[0];

        callback(null, user);
    }

    static async findUserByToken(token, callback?) {
        let pool = await this.create_pool();
        let result = await new sql.Request(pool)
                            .input("token", sql.UniqueIdentifier, token)
                            .query("select * from [vwUser] where token = @token");

        if(result.rowsAffected != 1) {
            console.log("user not found");
            
            if(callback)
                callback("user not fount", false);

            return;
        } 

        const user = result.recordset[0];

        if(callback)
            callback(null, user);
            
        return user;
    }

    static ensureLoggedIn() {
        return function(req, res, next) {
            // isAuthenticated is set by `deserializeUser()`
            if(process.env.LOAD_ENV === 'true') {
                next();
                return;
            }

            if (!req.isAuthenticated || !req.isAuthenticated()) {
                res.status(401).json({
                    success: false,
                    message: 'You need to be authenticated to access this page!'
                });
            } else {
                next();
            }
        }
    }

    static ensureHasPermission(permission: Permissions) {
        return function (req, res, next) {
            const userReq = SecurityService.getUserFromRequest(req);

            userReq.then((user) => {                
                let has_permission = false;

                if(user) {
                    switch(permission) {
                        case(Permissions.Operator):
                            has_permission = user.is_operator || user.is_director || user.is_manager;
                            break;
                        case(Permissions.Manager):
                            has_permission = user.is_director || user.is_manager;
                            break;
                        case(Permissions.Director):
                            has_permission = user.is_director;
                            break;
                    }
                }
    
                if(!has_permission) {
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
        }
    }

    static async getUserFromRequest(req) : Promise<User> {
        if(process.env.LOAD_ENV === 'true') {                        
            let user = this.findUserByToken(process.env.TOKEN_USER_DEV, () => {});
            return user;
        }

        return req.user;
    }
}