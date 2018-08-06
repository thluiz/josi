import { Branch } from './Branch';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Country } from "./Country";


@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(type => Country)
    @JoinColumn({ name: "country_id" })
    country: Country;

    @ManyToOne(type => Branch)
    @JoinColumn({ name: "branch_id" })
    branch: Branch;

    @Column()
    active: boolean;

    @Column()
    order: number;
}