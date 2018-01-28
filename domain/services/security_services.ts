const sql = require('mssql')

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

    static async findUserByToken(token, callback) {
        let pool = await this.create_pool();
        let result = await new sql.Request(pool)
                            .input("token", sql.UniqueIdentifier, token)
                            .query("select * from [user] where token = @token");

        if(result.rowsAffected != 1) {
            callback("user not fount", false);
            return;
        } 

        const user = result.recordset[0];

        callback(null, user);
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
}