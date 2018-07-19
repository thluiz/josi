import { ActivityType } from './../../services/person-service';

export class LightIncident {
    id: number;
    branch_id: number;
    card_id: number;
    incident_type: number;

    title: string;
    abrev:string;

    date: Date;
    started_on: Date;
    start_hour: string;

    cancelled: boolean;
    closed:boolean;
    past:boolean;
    need_start_hour_minute: boolean;
    need_to_be_started: boolean;

    branch_initials: string;

    person_id: number;
    person: string;

    communication_status: number;
    data_status:number;
    scheduling_status:number;
    financial_status:number;

    activity_type: ActivityType;
}