import { Connection, EntitySchema, Repository, QueryRunner } from "typeorm";
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

    static async ExecuteWithinTransaction<T>(fun: (queryRunner: QueryRunner) => Promise<Result<T>>): Promise<Result<T>> {        
        const conn = await DatabaseFacility.getConnection();
        const queryRunner = conn.createQueryRunner(); 

        try {            
            
            await queryRunner.startTransaction();            

            let result = await fun(queryRunner);
            
            await queryRunner.commitTransaction();

            return result;

        } catch (error) {
            await queryRunner.rollbackTransaction();

            return Result.Fail(ErrorCode.GenericError, error);
        }
    }

    static async ExecuteSPNoResults(procedure: string, ...parameters: any[]) : Promise<Result<void>> {
        let [conn_error, connection] = await to<Connection>(this.getConnection());

        if(conn_error) return Result.Fail(ErrorCode.FailedGetConnection, conn_error);        

        let {query, values} = this.buildSPParameters(procedure, parameters);
    
        let [err, result] = await to(connection.query(query, values));        

        if(err) return Result.Fail(ErrorCode.GenericError, err);                

        return Result.GeneralOk();
    } 

    static async ExecuteJsonSQL<T>(sql: string, ...parameters: any[]) : Promise<Result<T>> {
        try {
            let connection = await this.getConnection();        ;
        
            const result = await connection.query(sql, parameters);
                              
            return Result.GeneralOk(JSON.parse(result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]) as T);            
        } catch (error) {
            if(error instanceof SyntaxError && error.message.indexOf("Unexpected end of JSON input") >= 0) {
                return Result.GeneralOk({} as T);                
            }

            return Result.Fail(ErrorCode.GenericError, error);
        }
    }

    static async ExecuteTypedJsonSP<T>(result_type: string, procedure: string, ...parameters: any[]) : Promise<Result<T>> {
        return this.ExecuteSP<T>(result_type, procedure, true, parameters);
    }

    static async ExecuteJsonSP<T>(procedure: string, ...parameters: any[]) : Promise<Result<T>> {
        return this.ExecuteSP<T>("GENERIC_ACTION", procedure, true, parameters);
    }

    private static async ExecuteSP<T>(result_type: string, procedure: string, parseResults: boolean, parameters?: any[]) : Promise<Result<T>> {
        try {
            let connection = await this.getConnection();
            let {query, values} = this.buildSPParameters(procedure, parameters);
            
            const result = await connection.query(query, values);
            const data = result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];                   
            
            return parseResults ?  
                    Result.Ok(result_type, JSON.parse(data)) : Result.Ok(data);            
        } catch (error) {
            if(error instanceof SyntaxError && error.message.indexOf("Unexpected end of JSON input") >= 0) {
                return Result.Ok(result_type, {} as T);                
            }

            return Result.Fail(ErrorCode.GenericError, error);
        }
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

        return { query, values };
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