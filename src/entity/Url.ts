import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string

    @Column()
    url: string

    @Column()
    require_parameter: boolean
}