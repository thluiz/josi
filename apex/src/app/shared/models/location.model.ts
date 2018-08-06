export class Location {
    id: number;
    name: string;
    description: string;
    order: number;
    branch: { id: number; name: string; abrev: string, initials: string }
    country: { id: number; name: string; }
    active: boolean;
}
