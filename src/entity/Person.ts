import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable} from "typeorm";
import { Url } from "./Url";
import { Role } from "./Role";
import { Incident } from "./Incident";

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    is_interested: boolean

    @Column()
    is_operator: boolean

    @Column()
    is_director: boolean

    @Column()
    is_manager: boolean

    @Column()
    avatar_img: string

    @Column({name: "branch_id"})
    branch_id: number

    @ManyToOne(type => Url)
    @JoinColumn({ name: "default_page_id" })
    default_page: Url;

    @ManyToMany(type => Role, role => role.people)
    roles: Role[];

    incidents: Incident[];
}