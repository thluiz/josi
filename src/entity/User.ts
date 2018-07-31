import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Person } from "./Person";
import { DatabaseManager } from "../services/managers/database-manager";

let DBM = new DatabaseManager();

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

    async is_director() {
        await this.ensurePersonLoaded();
        return this.person.is_director;
    }

    async is_manager() {
        await this.ensurePersonLoaded();

        return this.person.is_manager;
    }

    async is_operator() {
        await this.ensurePersonLoaded();

        return this.person.is_operator;
    }

    async getPersonId(): Promise<number> {
        await this.ensurePersonLoaded();

        return this.person.id;
    }

    async getPerson(): Promise<Person> {
        await this.ensurePersonLoaded();

        return this.person;
    }

    private async ensurePersonLoaded() {
        if (this.person != null)
            return;

        const UR = await DBM.getRepository<User>(User);

        let user = await UR
            .createQueryBuilder("u")
            .innerJoinAndSelect("u.person", "p")
            .where("u.id = :id", { id: this.id })
            .cache(10000)
            .getOne();

        this.person = user.person;
    }
}
