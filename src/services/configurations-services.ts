import { DatabaseManager } from "./managers/database-manager";

const DBM = new DatabaseManager();

export enum Configurations {
    EMAIL_IM = 5
}

export class Constants {
    static IncidentTypeOwnership = 36;
    static IncidentTypeSupport = 39;
}

export class ConfigurationsService {
    static EMAIL_DEV = process.env.EMAIL_DEV;

    static async getConfiguration(configuration: Configurations) {
        let con = await DBM.getConnection();
        let result = await con.query(`select [value] from configuration where id = @0`,
            [ configuration.toFixed() ]);

        return result[0].value;
    }
}