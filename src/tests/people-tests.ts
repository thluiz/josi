require('dotenv').load();
import 'mocha';
import { QueryRunner } from 'typeorm';

import { DatabaseManager } from '../services/managers/database-manager';
import { expect } from 'chai';
import { PeopleService } from '../services/people-service';
import { Person } from '../entity/Person';

describe('People Tests', async function() {
    this.timeout(15000000);
    const dbm = new DatabaseManager();
    let runner : QueryRunner;
    let PS: PeopleService;

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        PS = new PeopleService(dbm, { runner, useTransaction: true, shouldCommit: false })
        await dbm.StartTransaction(runner);
    })

    afterEach(async() => {
        await dbm.RollbackTransaction(runner);
    });

    it('should create person', async () => {
        let result = await PS.create_person("TESTE person name", 4);

        expect(result.success);
        expect((result.data as Person).id).to.be.greaterThan(0);
    });

    it('should create interested', async () => {
        let result = await PS.create_person("TESTE person name", 4);
        expect(result.success);
        expect((result.data as Person).is_interested).to.be.true;
    });

});