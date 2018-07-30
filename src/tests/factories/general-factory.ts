import { QueryRunner } from 'typeorm';
import { User } from "../../entity/User";
import { Person } from "../../entity/Person";

export async function create_responsible(runner: QueryRunner) {
    return await create_person(runner);
}

export async function create_person(runner : QueryRunner) {
    let person = new Person();
    person.name = "Teste Person";
    await runner.manager.save(person);

    return person;
}