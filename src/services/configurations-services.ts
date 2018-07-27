import { DatabaseFacility } from "../facilities/database-facility";

export enum Configurations {
    EMAIL_IM = 5;
}

export class ConfigurationsService {
    static EMAIL_DEV = process.env.EMAIL_DEVELOPMENT;

    static async getConfiguration(configuration: Configurations) {
        let con = await DatabaseFacility.getConnection();
        let result = await con.query(`select [value] from configuration where id = @id`,
            [{ "id" :  configuration.toFixed() }]);

        return result[0].value;
    }
}