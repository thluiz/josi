import { Connection, EntitySchema, Repository } from "typeorm";
import "reflect-metadata";
import {createConnection} from "typeorm";
import to from 'await-to-js';
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";

export class DatabaseFacility {    
    private static _connection: Connection;    

    static async getRepository<T>(type: string | Function | (new () => any) | EntitySchema<T> )  : Promise<Repository<T>> {
        let connection = await this.getConnection();

        return await connection.getRepository(type);
    }

    static async ExecuteSPNoResults(procedure: string, ...parameters: any[]) : Promise<Result<void>> {
        let [conn_error, connection] = await to<Connection>(this.getConnection());

        if(conn_error) return Result.Fail(ErrorCode.FailedGetConnection, conn_error);        

        let {query, values} = this.buildSPParameters(procedure, parameters);
    
        let [err, result] = await to(connection.query(query, values));        

        if(err) return Result.Fail(ErrorCode.GenericError, err);                

        return Result.Ok();
    } 

    static async ExecuteJsonSP<T>(procedure: string, parameters?: any[]) : Promise<T> {
        let connection = await this.getConnection();
        let {query, values} = this.buildSPParameters(procedure, parameters);
    
        const result = await connection.query(query, values);
                          
        return JSON.parse(result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]) as T;
    }

    private static buildSPParameters(procedure: string, parameters: any[]) : { query: string, values: any[]} {
        let values = [];
        let query = `exec ${procedure} `;

        if(parameters != null) {
            query += parameters.map((p, i) => {
                return `@${Object.keys(p)[0]} = @${i}`;
            }).join(", ");

            parameters.map((p) => p[Object.keys(p)[0]])
            .forEach(p => values.push(p));
        }  

        return { query, values};
    }

    static async getConnection() : Promise<Connection> {
        if(!this._connection) {
            this._connection = await createConnection({
                type: 'mssql',
                host: process.env.SQL_HOST,        
                username: process.env.SQL_DATABASE,
                password: process.env.SQL_PASSWORD,
                database: process.env.SQL_DATABASE,
                extra: { options: { encrypt: true}},
                logging: true,
                synchronize: false,
                entities: [
                    "src/entity/*.js"
                ],
                subscribers: [
                    "src/subscriber/*.js"
                ],
                migrations: [
                    "src/migration/*.js"
                ],
                cli: {
                    entitiesDir: "entity",
                    migrationsDir: "migration",
                    subscribersDir: "subscriber"
                }
            });
        }

        return this._connection;
    }
}