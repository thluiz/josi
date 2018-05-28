export class LightIncident {
    id: number;    
    branch_id: number; 
    cancelled: boolean;
    card_id: number;
    closed:boolean;
    past:boolean;
    date: Date;
    incident_type: number;
    title: string;
    abrev:string;
    need_start_hour_minute: boolean;
    need_to_be_started: boolean;
    branch_initials: string;
    person_id: number;
    person: string;
    communication_status: number;
    data_status:number;
    scheduling_status:number;
    financial_status:number;
}