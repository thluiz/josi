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
    
    @Column()
    active: boolean;

    @Column()
    order: number;
}