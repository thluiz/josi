import { IntegratedEvent } from "./IntegratedEvent";

export class EventGroup {
    id: number;
    title: string;
    description: string;
    events: IntegratedEvent[];
    start_date: string;
    end_date: string;
}
