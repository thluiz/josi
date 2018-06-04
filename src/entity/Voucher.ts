import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Branch } from "./Branch";

@Entity()
export class Voucher {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    title: string;

    @Column()
    url: string;

    @Column()    
    header_text: string;

    @Column()
    initials: string;

    @Column()
    additional_question: string;

    @Column()
    final_text: string;

    @Column()
    confirm_button_text: string;

    @Column()
    header_title: string;

    @Column()
    anonymous_header_text: string;

    @Column()
    active: boolean;

    @ManyToMany(type => Branch)
    @JoinTable({    
        name: "branch_voucher",
        joinColumns : [ {name: "voucher_id" }],
        inverseJoinColumns: [{name: "branch_id"}]
    })
    branches: Branch[];
} 