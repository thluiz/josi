import { BranchCategory } from './BranchCategory';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Location } from './Location';
import { Currency } from './Currency';
import { Timezone } from './Timezone';

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

    @ManyToOne(type => Currency)
    @JoinColumn({ name: "default_currency_id" })
    default_currency: Currency;

    @ManyToOne(type => Timezone)
    @JoinColumn({ name: "timezone_id" })
    timezone: Timezone;

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