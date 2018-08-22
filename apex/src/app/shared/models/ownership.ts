export class Ownership {
    id: number;
    branch_id: number;
    location_id: number;

    title: string;
    description: string;

    date: Date;
    end_date: Date;
    started_on: Date;

    cancelled: boolean;
    closed:boolean;
    past:boolean;

    branch_initials: string;

    person_id: number;
    person: string;
}
