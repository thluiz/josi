import { PersonIncident } from './../entity/PersonIncident';
import { IncidentType } from './../entity/IncidentType';
import { DataRunner, DatabaseManager } from './managers/database-manager';
import { Result, SuccessResult, ErrorResult } from '../helpers/result';
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
export const INCIDENT_COMMENT_ADDED = "INCIDENT_COMMENT_ADDED";
export const INCIDENT_COMMENT_ARCHIVED = "INCIDENT_COMMENT_ARCHIVED";

export interface IRegisterIncident {
    incident : Incident,
    responsible : Person,
    start_activity: boolean,
    register_closed: boolean,
    register_treated: boolean,
    people: Person[],
    new_owner?: Person,
    new_support?: Person,
    addToOwnership: AddToOwnership,
    ownership?: Incident
}

export interface IRegisterPersonIncident {
    incident : Incident,
    responsible : Person,
    start_activity: boolean,
    register_closed: boolean,
    register_treated: boolean,
    person: Person,
    ownership?: Incident
}

export interface IRegisterOwnership {
    incident : Incident,
    responsible : Person,
    start_activity: boolean,
    register_closed: boolean,
    register_treated: boolean,
    new_owner: Person,
    new_support: Person
}

export enum IncidentErrors {
    MissingResponsible,
    MissingOwnership,
    MissingOwnerOrSupport,
    ValueNeeded,
    PaymentMethodNeeded,
    TitleNeeded
}

export interface IOwnershipWithSupport {
    ownership: Incident,
    support: Incident
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

    @trylog2()
    @firebaseEmitter(EVENTS_COLLECTION)
    async close_incident(incident : Incident, responsible : Person): Promise<Result<Incident>> {
        let execution = await (await this.databaseManager).ExecuteTypedJsonSP<Incident>(
            INCIDENT_ENDED,
            "CloseIncident",
            [{ "incident": incident.id },
            { "close_description": incident.close_text || "" },
            { "title": incident.title || "" },
            { "responsible_id": responsible.id },
            { "fund_value": incident.fund_value || null },
            { "payment_method_id": incident.payment_method_id > 0 ?
                                    incident.payment_method_id : null }],
            await this.dataRunner
        );

        return execution;
    }

    @trylog2()
    @firebaseEmitter(EVENTS_COLLECTION)
    async close_incident_and_send_ownership_report(incident : Incident, responsible : Person)
    : Promise<Result<Incident>> {

        let closing = await this.close_incident(incident, responsible);

        if (closing.success && incident.type.id == Constants.IncidentTypeOwnership) {
            await OwnershipClosingReport.send(incident);
        }

        return closing;
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
    async create_people_incidents(data: IRegisterIncident) : Promise<Result<Incident[]>> {
        const incidents : Incident[] = [];
        let ownership: Incident;

        if(data.addToOwnership == AddToOwnership.AddToNewOwnership) {
            let ownership_data = Object.assign({
                new_owner: data.new_owner,
                new_support: data.new_support
            }, data) as IRegisterOwnership;

            let ownership_register = await this.create_ownership(
                ownership_data
            );

            if(!ownership_register.success) {
                return ownership_register as ErrorResult;
            }

            let ownership_and_support = ownership_register.data as IOwnershipWithSupport;

            ownership = ownership_and_support.ownership;
            incidents.push(ownership);
            incidents.push(ownership_and_support.support);
        }

        for(let person of data.people) {
            let incident_data = Object.assign({ person }, data) as IRegisterPersonIncident;
            if(data.addToOwnership == AddToOwnership.AddToNewOwnership) {
                incident_data.ownership = ownership;
            }
            let incident_register = await this.create_incident_for_person(incident_data);
            if(!incident_register.success) {
                return incident_register as ErrorResult;
            }

            incidents.push(incident_register.data as Incident);
        }

        return SuccessResult.Ok(INCIDENT_ADDED, incidents);
    }


    async create_incident_for_person(data: IRegisterPersonIncident)
    : Promise<Result<Incident>> {
        if(!data.responsible) {
            return ErrorResult.Fail(ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingResponsible])
            );
        }

        if(data.incident.type.require_ownership && !data.ownership) {
            return ErrorResult.Fail(ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingOwnership]))
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
            return ErrorResult.Fail(ErrorCode.ValidationError,
                    new Error(IncidentErrors[IncidentErrors.ValueNeeded]))
        }

        if(incident.type.require_title
            && (incident.title || "").length <= 0) {
            let error = new Error(IncidentErrors[IncidentErrors.TitleNeeded]);
            return ErrorResult.Fail(ErrorCode.ValidationError, error);
        }

        if(incident.type.require_payment_method
            && incident.payment_method_id <= 0) {
            return ErrorResult.Fail(ErrorCode.ValidationError,
                    new Error(IncidentErrors[IncidentErrors.PaymentMethodNeeded]))
        }

        incident.ownership = data.ownership;
        incident.people_incidents = [ PersonIncident.create(incident, data.person) ];

        await this.save(incident);

        return SuccessResult.Ok(INCIDENT_ADDED, incident);
    }

    async create_ownership(data: IRegisterOwnership)
    : Promise<Result<IOwnershipWithSupport>> {
        if(!data.new_owner || !data.new_support) {
            return ErrorResult.Fail(
                ErrorCode.ValidationError,
                new Error(IncidentErrors[IncidentErrors.MissingOwnerOrSupport])
            );
        }

        let ownership_data = Incident.duplicate(data.incident);
        ownership_data.type = (await (await this.getRepository(IncidentType))
                                .findOne(Constants.IncidentTypeOwnership))
        if(data.incident.type.need_fund_value) {
            ownership_data.define_fund_value = true;
        }

        const ownership_result = await this.create_incident_for_person({
                incident: ownership_data,
                person: data.new_owner,
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible
            }
        );

        if(!ownership_result.success) {
            return ownership_result as ErrorResult;
        }

        let ownership = ownership_result.data as Incident
        let support_data = Incident.duplicate(data.incident);
        support_data.type = (await (await this.getRepository(IncidentType))
                                .findOne(Constants.IncidentTypeSupport))

        const support_result = await this.create_incident_for_person({
                incident: support_data,
                person: data.new_support,
                register_closed: data.register_closed,
                register_treated: data.register_treated,
                start_activity: data.start_activity,
                responsible: data.responsible,
                ownership: ownership
            }
        );

        if(!support_result.success) {
            return support_result as ErrorResult;
        }
        let support = support_result.data as Incident;

        return SuccessResult.Ok(INCIDENT_ADDED, { ownership, support });
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
    async get_comments(incident_id: number, show_archived: boolean): Promise<Result> {
        const result = await (await this.databaseManager)
                        .ExecuteJsonSP("GetIncidentComments",
                        { incident_id }, { show_archived }
                    )

        return result;
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
            { "responsible_id": responsible_id }],
            (await this.dataRunner)
        );

        return execution;
    }

    @trylog2()
    @firebaseEmitter(EVENTS_COLLECTION)
    async save_comment(incident_id, comment, responsible_id) {
        return await (await this.databaseManager)
        .ExecuteTypedJsonSP(
            INCIDENT_COMMENT_ADDED,
            "SaveIncidentComment",
            [{incident_id}, { comment }, {responsible_id}],
            (await this.dataRunner));
    }

    @trylog2()
    @firebaseEmitter(EVENTS_COLLECTION)
    async archive_comment(comment_id) {
        return await (await this.databaseManager)
        .ExecuteTypedJsonSP(
            INCIDENT_COMMENT_ARCHIVED,
            "TogleIncidentCommentArchived",
            [{ comment_id }],
            (await this.dataRunner));
    }
}