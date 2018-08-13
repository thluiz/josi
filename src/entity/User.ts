// tslint:disable:variable-name

import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DatabaseManager } from "../services/managers/database-manager";
import { Person } from "./Person";

const DBM = new DatabaseManager();

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    login_provider_id: number;

    @ManyToOne(() => Person)
    @JoinColumn({ name: "person_id" })
    person: Person;

    @Column()
    default_branch_id: number;

    @Column()
    token: string;

    async is_director() {
        await this.loadPersonIfNeeded();
        return this.person.is_director;
    }

    async is_manager() {
        await this.loadPersonIfNeeded();

        return this.person.is_manager;
    }

    async is_operator() {
        await this.loadPersonIfNeeded();

        return this.person.is_operator;
    }

    async getPersonId(): Promise<number> {
        await this.loadPersonIfNeeded();

        return this.person.id;
    }

    async getPerson(): Promise<Person> {
        await this.loadPersonIfNeeded();

        return this.person;
    }

    async loadPersonIfNeeded() {
        if (this.person != null) { return; }

        const UR = await DBM.getRepository<User>(User);

        const user = await UR.manager
            .createQueryBuilder(User, "u")
            .innerJoinAndSelect("u.person", "p")
            .leftJoinAndSelect("p.default_page", "dp")
            .where("u.id = :id", { id: this.id })
            .cache(10000)
            .getOne();

        this.person = user.person;
    }
}
