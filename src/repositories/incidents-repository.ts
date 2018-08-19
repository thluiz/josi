import showdown = require("showdown");
import { Repository } from "typeorm";
import { BaseRepository } from "./base-repository";

import { tryLogAsync } from "../decorators/trylog-decorator";
import { Result, SuccessResult } from "../helpers/result";

import { Incident } from "../entity/Incident";
import { DatabaseManager } from "../services/managers/database-manager";
import { DependencyManager } from "../services/managers/dependency-manager";
import { cache } from "../decorators/cache-decorator";

const converter = new showdown.Converter();
const DBM = DependencyManager.container.resolve(DatabaseManager);

export class IncidentsRepository extends BaseRepository<Incident> {

    private summaryCache: Array<{ branch: number;
        date: any;
        week_modifier: number;
        lastcall: number;
        result: Result<any>;
    }> = [];

    constructor() {
        super(Incident);
    }

    @tryLogAsync()
    async getAgenda(branchId, date): Promise<Result<any>> {
        return await this.DBM.ExecuteJsonSP("GetAgenda2",
            { branch_id: branchId },
            { date }
        );
    }

    @tryLogAsync()
    async getAvailableOwnerships(branchId, date, type): Promise<Result<Incident>> {
        const result = await this.DBM.ExecuteJsonSP<Incident>("GetAvailableOwnerships",
            { branch_id: branchId },
            { date },
            { type }
        );

        return result;
    }

    @cache(true, 100000, (branchId) => `getCurrentActivities_${branchId || "all"}`)
    @tryLogAsync()
    async getCurrentActivities(branchId): Promise<Result<any>> {
        const result = await this.DBM.ExecuteJsonSP("GetCurrentActivities",
            { branch_id: branchId }
        );

        return result;
    }

    @tryLogAsync()
    async getPeopleSummary(branchId, weekModifier, date): Promise<Result<any>> {
        this.summaryCache = this.summaryCache
        .filter((c) => c.lastcall < ((new Date()).getTime() - 10000)); // clear every 10 seconds

        const cached = this.summaryCache = this.summaryCache
        .filter((c) => c.branch === branchId
                    && c.week_modifier === weekModifier
                    && c.date === date);

        if (cached.length > 0) {
            return cached[0].result;
        }

        const result = await this.DBM.ExecuteJsonSP("GetPeopleSummary",
            { branch: branchId },
            { week_modifier: weekModifier },
            { date }
        );

        this.summaryCache.push({
            branch: branchId,
            week_modifier: weekModifier,
            date,
            lastcall: (new Date()).getTime(),
            result
        });

        return result;
    }

    @tryLogAsync()
    async getSummary(branchId, monthModifier, weekModifier, date): Promise<Result<any>> {
        return await this.DBM.ExecuteJsonSP("GetPeopleSummary",
            { branch: branchId },
            { month_modifier: monthModifier },
            { week_modifier: weekModifier },
            { date }
        );
    }

    @tryLogAsync()
    async getDailyMonitor(branchId, display, displayModifier): Promise<Result<any>> {
        return await this.DBM.ExecuteJsonSP("GetDailyMonitor2",
            { branch: branchId },
            { display_modifier: displayModifier },
            { display }
        );
    }

    @tryLogAsync()
    async getPersonIncidentsHistory(personId, startDate, endDate, activityType): Promise<Result<any>> {
        return await this.DBM.ExecuteJsonSP("GetPersonIncidentHistory2",
            { person_id: personId },
            { start_date: startDate },
            { end_date: endDate },
            { activity_type: activityType }
        );
    }

    @tryLogAsync()
    async getIncidentDetails(incidentId): Promise<Result<any>> {
        return await this.DBM.ExecuteJsonSP("GetIncidentDetails",
            { id: incidentId }
        );
    }

    @tryLogAsync()
    async getOwnershipData(id: number): Promise<Result<any>> {
        const ownershipData = await this.DBM.ExecuteJsonSP("getOwnershipData", {
            ownership_id: id
        });

        const data = ownershipData.data[0];

        if (!data.incidents) {
            data.incidents = [];
        }

        for (const incident of data.incidents) {
            if (incident.description) {
                const d = incident.description.replace(/\r?\n/g, "<br />");
                incident.description = converter.makeHtml(d);
            }
            if (incident.close_text) {
                const d = incident.close_text.replace(/\r?\n/g, "<br />");
                incident.close_text = converter.makeHtml(d);
            }
        }

        return SuccessResult.GeneralOk(data);
    }
}
