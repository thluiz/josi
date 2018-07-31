import { expect } from 'chai';
require('dotenv').load();

import { User } from './../entity/User';

import 'mocha';
import { QueryRunner, Repository } from 'typeorm';

import { IncidentsService } from '../services/incidents-service';
import { DatabaseManager } from '../services/managers/database-manager';

describe('Security Tests', async function () {
    this.timeout(15000000);
    let runner: QueryRunner;
    let IS: IncidentsService;
    let UR: Repository<User>;
    const dbm = new DatabaseManager();

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        IS = new IncidentsService(dbm, { runner, useTransaction: true, shouldCommit: false });
        UR = await runner.manager.getRepository<User>(User);

        await runner.startTransaction();
    })

    afterEach(async () => {
        await dbm.RollbackTransaction(runner);
    });

    it('should load person from user', async () => {
        let user = await UR.findOne(4);
        let person = await user.getPerson()

        expect(person.id).to.be.greaterThan(0);
    });
})