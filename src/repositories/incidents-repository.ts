import { Repository } from 'typeorm';
import { DatabaseFacility } from "../facilities/database-facility";
import { Result } from "../helpers/result";
import { ErrorCode } from "../helpers/errors-codes";
import { trylog } from "../decorators/trylog-decorator";
import showdown = require('showdown');
import { Incident } from "../entity/Incident";
const converter = new showdown.Converter();

export class IncidentsRepository {

    @trylog()
    static async getRepository(): Promise<Repository<Incident>> {
        return await DatabaseFacility.getRepository<Incident>(Incident);
    }

    @trylog()
    static async getCurrentActivities(branch_id): Promise<Result<any>> {
        let result = await DatabaseFacility.ExecuteJsonSP("GetCurrentActivities",
            { "branch_id": branch_id }
        );

        return result;
    }

    @trylog()
    static async getPeopleSummary(branch_id, week_modifier, date): Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetPeopleSummary",
            { "branch": branch_id },
            { "week_modifier": week_modifier },
            { "date": date }
        );
    }

    @trylog()
    static async getSummary(branch_id, month_modifier, week_modifier, date): Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetPeopleSummary",
            { "branch": branch_id },
            { "month_modifier": month_modifier },
            { "week_modifier": week_modifier },
            { "date": date }
        );
    }

    @trylog()
    static async getDailyMonitor(branch_id, display, display_modifier): Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetDailyMonitor2",
            { "branch": branch_id },
            { "display_modifier": display_modifier },
            { "display": display }
        );
    }

    @trylog()
    static async getPersonIncidentsHistory(person_id, start_date, end_date, activity_type): Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetPersonIncidentHistory2",
            { "person_id": person_id },
            { "start_date": start_date },
            { "end_date": end_date },
            { "activity_type": activity_type }
        );
    }

    @trylog()
    static async getIncidentDetails(incident_id): Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetIncidentDetails",
            { "id": incident_id }
        );
    }

    @trylog()
    static async getAgenda(branch_id, date): Promise<Result<any>> {
        return await DatabaseFacility.ExecuteJsonSP("GetAgenda2",
            { "branch_id": branch_id },
            { "date": date }
        );
    }

    @trylog()
    static async getOwnershipData(id: number): Promise<Result<any>> {
        const ownership_data = await DatabaseFacility.ExecuteJsonSP("getOwnershipData", {
            "ownership_id": id
        });

        const data = ownership_data.data[0];

        for (var i = 0; i < data.incidents.length; i++) {
            if (data.incidents[i].description) {
                const d = data.incidents[i].description.replace(/\r?\n/g, "<br />");
                console.log(d);
                data.incidents[i].description = converter.makeHtml(d);
            }
            if (data.incidents[i].close_text) {
                const d = data.incidents[i].close_text.replace(/\r?\n/g, "<br />");
                data.incidents[i].close_text = converter.makeHtml(d);
            }
        }

        return Result.GeneralOk(data);
    }
}