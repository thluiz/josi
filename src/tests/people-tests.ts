require('dotenv').load();
import 'mocha';
import { QueryRunner, Repository } from 'typeorm';

import { Person } from './../entity/Person';
import { IncidentsService, AddToOwnership, IncidentErrors } from '../services/incidents-service';
import * as IF from './factories/incident-factory';
import * as GF from './factories/general-factory';
import { DatabaseManager } from '../services/managers/database-manager';
import { expect } from 'chai';
import { PeopleService } from '../services/people-service';
import { Incident } from '../entity/Incident';
import { IncidentType } from '../entity/IncidentType';

describe('People Tests', async function() {
    this.timeout(15000);
    const dbm = new DatabaseManager();
    let runner : QueryRunner;
    let IS: IncidentsService;
    let PS: PeopleService;
    let ITR : Repository<IncidentType>;

    beforeEach(async () => {
        runner = await dbm.StartTransaction();
        IS = new IncidentsService(dbm, { runner, shouldCommit: false });
        PS = new PeopleService(dbm, { runner, shouldCommit: false })
        ITR = await runner.manager.getRepository<IncidentType>(IncidentType);
    })

    afterEach(async() => {
        await dbm.RollbackTransaction(runner);
    });

    it('should create person', async () => {
        let result = await PS.create_person("TESTE person name", 4);

        expect(result.success);
        expect(result.data.id).to.be.greaterThan(0);
    });

    it('should create interested', async () => {
        let result = await PS.create_person("TESTE person name", 4);
        expect(result.success);
        expect(result.data.is_interested).to.be.true;
    });

});