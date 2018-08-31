import { IncidentComment } from "app/shared/models/IncidentComment";

export class Ownership {
    id: number;
    branch_id: number;
    location_id: number;

    title: string;
    description: string;

    date: string;
    end_date: string;
    started_on: string;
    closed_on: string;

    cancelled: boolean;
    closed:boolean;
    past:boolean;

    branch_initials: string;

    person_id: number;
    person_name: string;

    started_date_in_seconds : number;
    date_in_seconds : number;

    comments: IncidentComment[];
}
