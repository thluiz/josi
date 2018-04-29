import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Person } from "./Person";
import { DatabaseFacility } from "../facilities/database-facility";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    login_provider_id: number;

    @ManyToOne(type => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @Column()
    default_branch_id: number;

    @Column()
    token: string;

    is_director() {
        return this.person.is_director;
    }

    is_manager() {
        return this.person.is_manager;
    }

    is_operator() {
        return this.person.is_operator;
    }

    async getPersonId() : Promise<number> {
        if(this.person == null) {
            const UR = await DatabaseFacility.getRepository<User>(User);
            let user = await UR.findOne(
                { id: this.id },
                { relations: [ "person"] }
            );

            return user.person.id[0];
        }
        return this.person.id[0];
    }
}
