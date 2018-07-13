import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Branch } from "./Branch";

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    incident_type: number;

    @ManyToOne(type => Branch)
    @JoinColumn({ name: "branch_id" })
    branch: Branch;
}