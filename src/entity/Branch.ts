import { BranchCategory } from './BranchCategory';
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Location } from './Location';

@Entity()
export class Branch {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    abrev: string;    

    @Column()
    initials: string;

    @ManyToOne(type => BranchCategory)
    @JoinColumn({ name: "category_id" })
    category: BranchCategory;

    @ManyToOne(type => Location)
    @JoinColumn({ name: "location_id" })
    location: Location;

    @Column()
    active: boolean;

    @Column()
    has_voucher: boolean;

    @Column()
    order: number;

    @Column()
    contact_phone: string;

    @Column()
    contact_email: string;
}