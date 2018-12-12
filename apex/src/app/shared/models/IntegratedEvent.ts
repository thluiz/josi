export class IntegratedEvent {
    id: number;
    branch_id?: number;
    location_id: number;
    timezone_id: number;
    gmt:number;

    title: string;
    description?: string;

    start_date: string;
    end_date: string;

    location_name?: string;
    location_description?: string;

    ownership_id?: number;
    owner?: string;
    first_surrogate?: string;
    second_surrogate?: string;

    open_to?: string[];
}
