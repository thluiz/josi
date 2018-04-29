import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Url } from "./Url";

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string

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

    @Column({name: "branch_id"})
    default_branch_id: number

    @ManyToOne(type => Url)
    @JoinColumn({ name: "default_page_id" })
    default_page: Url;
}