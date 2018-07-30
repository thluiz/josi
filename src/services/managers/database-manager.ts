import { DataRunner } from './database-manager';
import { Connection, EntitySchema, Repository, QueryRunner, getManager } from "typeorm";
import "reflect-metadata";
import { createConnection } from "typeorm";
import to from 'await-to-js';
import { Result } from "../../helpers/result";
import { ErrorCode } from "../../helpers/errors-codes";

export interface DataRunner<T = any> {
    data?: T,
    runner: QueryRunner,
    useTransaction: boolean,
    shouldCommit: boolean
}

let connection : Connection = null;

async function getGlobalConnection() : Promise<Connection> {
    if (!connection) {
        connection = await createConnection({
            type: 'mssql',
            host: process.env.SQL_HOST,
            username: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            extra: { options: { encrypt: true } },
            logging: process.env.SQL_SHOW_LOGGING === "true",
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

    return connection;
}

export class DatabaseManager {
    async getConnection() {
        return getGlobalConnection();
    }

    async getRepository<T>(
        type: string | Function | (new () => any) | EntitySchema<T>,
        runner?: QueryRunner
    ): Promise<Repository<T>> {

        let connection = await (runner ? runner.connection : getGlobalConnection());

        return await connection.getRepository(type);
    }

    async CreateQueryRunner(): Promise<QueryRunner> {
        const conn = await getGlobalConnection();
        const queryRunner = conn.createQueryRunner();

        if(!queryRunner.connection.isConnected) {
            await queryRunner.connection.connect();
        }

        return queryRunner;
    }

    async StartTransaction(queryRunner): Promise<QueryRunner> {
        await queryRunner.startTransaction();

        return queryRunner;
    }

    async CommitTransaction(queryRunner: QueryRunner): Promise<void> {
        queryRunner.commitTransaction();
    }

    async RollbackTransaction(queryRunner: QueryRunner): Promise<void> {
        queryRunner.rollbackTransaction();
    }

    async ExecuteWithinTransaction<T>(fun: (queryRunner: QueryRunner) => Promise<Result<T>>,
        queryRunner?: QueryRunner): Promise<Result<T>> {

        if (queryRunner) {
            return fun(queryRunner);
        }

        const conn = await getGlobalConnection();
        queryRunner = conn.createQueryRunner();

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

    async ExecuteSPNoResults(procedure: string, ...parameters: any[]): Promise<Result<void>> {
        let [conn_error, connection] = await to<Connection>(getGlobalConnection());

        if (conn_error) return Result.Fail(ErrorCode.FailedGetConnection, conn_error);

        let { query, values } = this.buildSPParameters(procedure, parameters);

        let [err, _] = await to(connection.query(query, values));

        if (err) return Result.Fail(ErrorCode.GenericError, err);

        return Result.GeneralOk();
    }

    async ExecuteJsonSQL<T>(sql: string, ...parameters: any[]): Promise<Result<T>> {
        try {
            let connection = await getGlobalConnection();

            const result = await connection.query(sql, parameters);

            return Result.GeneralOk(JSON.parse(result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]) as T);
        } catch (error) {
            if (error instanceof SyntaxError && error.message.indexOf("Unexpected end of JSON input") >= 0) {
                return Result.GeneralOk({} as T);
            }

            return Result.Fail(ErrorCode.GenericError, error);
        }
    }

    async ExecuteTypedJsonSP<T>(result_type: string,
        procedure: string, parameters?: any[], runner?: DataRunner): Promise<Result<T>> {
        return this.ExecuteSP<T>(result_type, procedure, true, parameters, runner);
    }

    async ExecuteJsonSP<T>(procedure: string, ...parameters: any[]): Promise<Result<T>> {
        return this.ExecuteSP<T>("GENERIC_ACTION", procedure, true, parameters);
    }

    async CloseConnection() {
        let conn = await getGlobalConnection();
        conn.close();
    }

    private async ExecuteSP<T>(result_type: string,
        procedure: string, parseResults: boolean, parameters?: any[],
        data_runner?: DataRunner): Promise<Result<T>> {
        try {
            if (!data_runner) {
                data_runner = {
                    runner: await this.CreateQueryRunner(),
                    useTransaction: false,
                    shouldCommit: false
                }
            }

            let connection = await getGlobalConnection();
            let { query, values } = this.buildSPParameters(procedure, parameters);

            const result = await connection.query(query, values);
            const data = result[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];

            if (data_runner.shouldCommit)
                await data_runner.runner.commitTransaction();

            return parseResults ?
                Result.Ok(result_type, JSON.parse(data)) : Result.Ok(data);
        } catch (error) {
            if (error instanceof SyntaxError && error.message.indexOf("Unexpected end of JSON input") >= 0) {
                if (data_runner.shouldCommit)
                    await data_runner.runner.commitTransaction();
                return Result.Ok(result_type, new Array() as any);
            }

            await data_runner.runner.rollbackTransaction();
            return Result.Fail(ErrorCode.GenericError, error);
        }
    }

    private buildSPParameters(procedure: string, parameters: any[]): { query: string, values: any[] } {
        let values = [];
        let query = `exec ${procedure} `;

        if (parameters != null) {
            query += parameters.map((p, i) => {
                return `@${Object.keys(p)[0]} = @${i}`;
            }).join(", ");

            parameters.map((p) => p[Object.keys(p)[0]])
                .forEach(p => values.push(p));
        }

        return { query, values };
    }
}