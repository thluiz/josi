import { Column } from 'typeorm';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './Person';
import { Incident } from './Incident';

@Entity()
export class PersonIncident {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @ManyToOne(type => Incident, incident => incident.people_incidents)
    @JoinColumn({ name: "incident_id" })
    incident: Incident;

    @Column()
    participation_type: number;

    @Column()
    closed: boolean;

    static create(incident: Incident, person: Person) : PersonIncident {
        let result = new PersonIncident();
        result.closed = false;
        result.participation_type = 1;
        result.incident = incident;
        result.person = person;
        return result;
    }
}