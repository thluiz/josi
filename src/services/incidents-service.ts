import { concat } from 'rxjs';
import { PersonIncident } from './../entity/PersonIncident';
import { IncidentType } from './../entity/IncidentType';
import { DataRunner, DatabaseManager } from './managers/database-manager';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';
import { LoggerService } from './logger-service';
import { trylog, trylog2 } from '../decorators/trylog-decorator';
import { firebaseEmitter } from '../decorators/firebase-emitter-decorator';
import { Incident } from '../entity/Incident';
import { OwnershipClosingReport } from './reports/ownership-closing-report';
import { BaseService } from './base-service';
import { Person } from '../entity/Person';
import { Constants } from './configurations-services';

export const EVENTS_COLLECTION = "incident-events";
export const INCIDENT_ADDED = "INCIDENT_ADDED";
export const INCIDENT_STARTED = "INCIDENT_STARTED";
export const INCIDENT_CHANGED = "INCIDENT_CHANGED";
export const INCIDENT_TREATED = "INCIDENT_TREATED";
export const INCIDENT_ENDED = "INCIDENT_ENDED";
export const INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
export const INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";

export interface IRegisterIncident {
    incident : Incident,
    people: Person[],
    responsible : Person,
    start_activity: boolean,
    register_closed: boolean,
    register_treated: boolean,
    new_owner?: Person,
    new_support?: Person,
    addToOwnership: AddToOwnership,
    ownership?: Incident
}

export enum IncidentErrors {
    MissingResponsible,
    MissingOwnership,
    MissingOwnerOrSupport,
    ToManyPeopleShouldSendOnlyOne,
    ValueNeeded,
    PaymentMethodNeeded,
    TitleNeeded
}

export enum AddToOwnership {
    DoNotAddToOwnership,
    AddToNewOwnership,
    AddToExistingOwnership
}


export class IncidentsService extends BaseService {

    constructor(databaseManager? : DatabaseManager, dataRunner? : DataRunner) {
        super(databaseManager, dataRunner);
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async start_incident(incident, responsible_id): Promise<Result> {
        let execution = await (await this.databaseManager)
            .ExecuteTypedJsonSP(INCIDENT_STARTED,
                "StartIncident",
                [{ "incident": incident.id },
                { "responsible_id": responsible_id }]
            );

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async reopen_incident(incident, responsible_id): Promise<Result> {
        let execution = await (await this.databaseManager)
        .ExecuteTypedJsonSP(
            INCIDENT_STARTED,
            "ReopenIncident",
            [{ "incident": incident.id },
            { "responsible_id": responsible_id }]
        );

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async cancel_start_incident(incident, responsible_id): Promise<Result> {
        let execution = await (await this.databaseManager)
            .ExecuteTypedJsonSP(
                INCIDENT_CHANGED,
                "CancelIncidentStart",
                [{ "incident": incident.id },
                    { "responsible_id": responsible_id }]
            );

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async close_incident(incident, responsible_id): Promise<Result> {
        let execution = await (await this.databaseManager).ExecuteTypedJsonSP(
            INCIDENT_ENDED,
            "CloseIncident",
            [{ "incident": incident.id },
            { "close_description": incident.close_text || "" },
            { "title": incident.title || "" },
            { "responsible_id": responsible_id },
            { "fund_value": incident.fund_value },
            { "payment_method_id": incident.payment_method_id > 0 ?
                                    incident.payment_method_id : null }],
            (await this.dataRunner)
        );

        if (execution.success) {
            try {
                const IR = await (await this.databaseManager).getRepository<Incident>(Incident);
                const light_incident = await IR.findOne(incident.id as number);

                if (light_incident.type.id == Constants.IncidentTypeOwnership) {
                    await OwnershipClosingReport.send(light_incident.id);
                }
            } catch (ex) {
                LoggerService.error(ErrorCode.SendingEmail, ex);
            }
        }

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async remove_incident(incident, responsible_id): Promise<Result> {
        let execution = await (await this.databaseManager).ExecuteTypedJsonSP(
            INCIDENT_CANCELLED,
            "RemoveIncident",
            [{ "incident": incident.id },
            { "responsible_id": responsible_id }]
        );

        return execution;
    }

    @trylog2()
    @firebaseEmitter(EVENTS_COLLECTION)
    async register_incident2(data: IRegisterIncident) : Promise<Result<Incident[]>> {
        const incidents : Incident[] = [];

        for(let person of data.people) {
            let incident_data = data;
            incident_data.people = [person];
            let incident_register = await this.register_incident_for_person(incident_data);
            if(!incident_register.success) {
                return incident_register;
            }

            incidents.push(...incident_register.data);
        }

        return Result.Ok(INCIDENT_ADDED, incidents);
    }


    async register_incident_for_person(data: IRegisterIncident)
    : Promise<Result<Incident[]>> {
        if(!data.responsible) {
            return Result.Fail(ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingResponsible])
            );
        }

        if(data.people.length > 1) {
            return Result.Fail(ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.ToManyPeopleShouldSendOnlyOne])
            );
        }

        var incident = data.incident;

        if(data.start_activity) {
            incident.started_by = data.responsible;
            incident.started_on = new Date();
        }

        if(data.register_closed || data.register_treated) {
            incident.closed_by = data.responsible;
            incident.closed_on = new Date();
            incident.closed = true;
        }

        if(data.register_treated) {
            incident.treated = true;
        }

        if(incident.type.need_value
            && incident.value <= 0) {
            return Result.Fail(ErrorCode.ValidationError,
                    new Error(IncidentErrors[IncidentErrors.ValueNeeded]))
        }

        if(incident.type.require_title
            && (incident.title || "").length <= 0) {
            let error = new Error(IncidentErrors[IncidentErrors.TitleNeeded]);
            return Result.Fail(ErrorCode.ValidationError, error);
        }

        if(incident.type.require_payment_method
            && incident.payment_method_id <= 0) {
            return Result.Fail(ErrorCode.ValidationError,
                    new Error(IncidentErrors[IncidentErrors.PaymentMethodNeeded]))
        }

        let get_ownership = await this.get_ownership_for_incident(data);
        if(!get_ownership.success) {
            return get_ownership;
        }

        incident.ownership = get_ownership.data ? get_ownership.data[0] : null;

        incident.people_incidents = [ PersonIncident.create(incident, data.people[0]) ];

        await this.save(incident);

        return Result.Ok(INCIDENT_ADDED, [ incident ]);
    }

    private async get_ownership_for_incident(data: IRegisterIncident) : Promise<Result<Incident[]>> {
        if(data.incident.type.require_ownership
            && data.addToOwnership === AddToOwnership.DoNotAddToOwnership) {
            return Result.Fail(ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingOwnership]))
        }

        switch (data.addToOwnership) {
            case AddToOwnership.AddToExistingOwnership:
                if(!data.ownership) {
                    return Result.Fail(ErrorCode.ValidationError,
                        new Error(IncidentErrors[IncidentErrors.MissingOwnership])
                    );
                }
                return Result.GeneralOk(data.ownership[0]);
            case AddToOwnership.AddToNewOwnership:
                let ownership_result = await this.generate_ownership_for_incident(data);

                return ownership_result;
            default:
                break;
        }

        return Result.GeneralOk(null);
    }

    private async generate_ownership_for_incident(data: IRegisterIncident)
    : Promise<Result<Incident[]>> {
        if(!data.new_owner || !data.new_support) {
            return Result.Fail(
                ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingOwnerOrSupport])
            );
        }

        let ownership = data.incident;
        ownership.type = (await (await this.getRepository(IncidentType))
                                .findOne(Constants.IncidentTypeOwnership))
        if(data.incident.type.need_fund_value) {
            ownership.define_fund_value = true;
        }

        const ownership_result = await this.register_incident_for_person({
                incident: ownership,
                people: [data.new_owner],
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible,
                addToOwnership: AddToOwnership.DoNotAddToOwnership
            }
        );

        if(!ownership_result.success) {
            return ownership_result;
        }

        let support = data.incident;
        support.type = (await (await this.getRepository(IncidentType))
                                .findOne(Constants.IncidentTypeSupport))

        const support_result = await this.register_incident_for_person({
                incident: support,
                people: [ data.new_support ],
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible,
                addToOwnership: AddToOwnership.AddToExistingOwnership,
                ownership: ownership_result.data[0]
            }
        );

        if(!support_result.success) {
            return support_result;
        }

        return ownership_result;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async register_incident(incident, responsible_id): Promise<Result> {
        let date = incident.date;

        if(incident.date && incident.date.year) {
            date = `${incident.date.year}-${incident.date.month}-${incident.date.day}`;
        }

        if (incident.time) {
            date += ` ${incident.time.hour}:${incident.time.minute}`;
        }

        let execution = await (await this.databaseManager)
            .ExecuteTypedJsonSP<any[]>(
                INCIDENT_ADDED,
                "RegisterNewIncident",
                [{ "description": incident.description },
                { "responsible_id": responsible_id },
                { "people": incident.people.filter(f => f.person_id > 0)
                                        .map(p => p.person_id).join(",") },
                { "date": date },
                { "type": incident.type.id },
                { "branch": incident.branch_id },
                { "title": incident.title },
                { "value": incident.value },
                { "start_activity": incident.start_activity ? 1 : 0 },
                { "register_closed": incident.close_activity == 1 ? 1 : 0 },
                { "register_treated": incident.close_activity == 2 ? 1 : 0 },
                { "new_people": incident.people.filter(f => f.person_id == 0)
                                .map(p => p.name.trim()).join(",") },
                { "add_to_ownernership": incident.add_to_ownernership},
                { "new_owner_id": incident.new_owner_id },
                { "new_support_id": incident.new_support_id },
                { "ownership_id": incident.ownership ? incident.ownership.id : null }],
                (await this.dataRunner)
        );

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async reschedule_incident(incident, new_incident, contact, responsible_id): Promise<Result> {
        let execution = await (await this.databaseManager).ExecuteTypedJsonSP(
            INCIDENT_RESCHEDULED,
            "RescheduleIncident",
            [{ "incident": incident.id },
            { "contact": contact },
            { "new_date": new_incident.date + ' ' + new_incident.start_hour },
            { "responsible_id": responsible_id }]
        );

        return execution;
    }

    @trylog()
    @firebaseEmitter(EVENTS_COLLECTION)
    async register_contact_for_incident(incident, contact, responsible_id): Promise<Result> {
        let execution = await (await this.databaseManager).ExecuteTypedJsonSP(
            INCIDENT_TREATED,
            "RegisterContactForIncident",
            [{ "incident": incident.id },
            { "contact": contact },
            { "responsible_id": responsible_id }]
        );

        return execution;
    }
}