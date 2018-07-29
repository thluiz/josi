import { PersonIncident } from './PersonIncident';
import { Person } from './Person';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Branch } from "./Branch";
import { Card } from './Card';
import { IncidentType } from './IncidentType';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => IncidentType)
    @JoinColumn({ name: "incident_type" })
    type: IncidentType;

    @Column({ type: 'datetime', default: () => 'getdate()'})
    created_on: Date;

    @Column()
    treated: boolean;

    @Column()
    closed: boolean;

    @Column()
    scheduled: boolean;

    @Column()
    date: Date;

    @Column()
    closed_on: Date;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "closed_by" })
    closed_by: Person;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "responsible_id" })
    responsible: Person;

    @ManyToOne(type => Branch)
    @JoinColumn({ name: "branch_id" })
    branch: Branch;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    close_text: string;

    @Column()
    fund_value: number;

    @Column()
    value: number;

    @Column()
    comment_count: number;

    @Column()
    cancelled: boolean;

    @Column()
    cancelled_on: Date;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "cancelled_by" })
    cancelled_by: Person;

    @Column()
    started_on: Date;

    @UpdateDateColumn({
		default: () => "getdate()",
		type: "datetime"
	})
    updated_at: Date;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "started_by" })
    started_by: Person;

    @ManyToOne(type => Card)
    @JoinColumn({ name: "card_id" })
    card_id: Card;

    @Column()
    person_schedule_id: number;

    @Column()
    payment_method_id: number;

    @Column()
    contact_method_id: number;

    @ManyToOne(type => Incident)
    @JoinColumn({ name: "ownership_id" })
    ownership: Incident;

    @OneToMany(type => PersonIncident, person_incident => person_incident.incident, { cascade: true })
    people_incidents: PersonIncident[];

    @Column()
    define_fund_value: boolean;
}