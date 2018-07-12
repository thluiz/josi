import {Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    incident_type: number;    
}