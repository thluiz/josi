require('dotenv').load();

import 'mocha';
import { QueryRunner, Repository } from 'typeorm';

import { IncidentsService } from '../services/incidents-service';

import { OwnershipClosingReport } from './../services/reports/ownership-closing-report';

import * as IF from './factories/incident-factory';
import * as GF from './factories/general-factory';
import { DatabaseManager } from '../services/managers/database-manager';
import { expect } from 'chai';
import { Incident } from '../entity/Incident';
import { IncidentType } from '../entity/IncidentType';
import { Constants } from '../services/configurations-services';
import { IncidentsRepository } from '../repositories/incidents-repository';

describe('Reporting Tests', async function () {
    this.timeout(15000000);
    let runner: QueryRunner;
    let IS: IncidentsService;
    let ITR: Repository<IncidentType>;
    const dbm = new DatabaseManager();

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        IS = new IncidentsService(dbm, { runner, useTransaction: true, shouldCommit: false });
        ITR = await runner.manager.getRepository<IncidentType>(IncidentType);

        await runner.startTransaction();
    })

    afterEach(async () => {
        await dbm.RollbackTransaction(runner);
    });

    it('should send ownership report', async () => {
        const incident_data = await IF.create(runner,
            await ITR.findOne(Constants.IncidentTypeOwnership)
        );

        const registering = await IS.create_incident_for_person({
            incident: incident_data,
            person: (await GF.create_person(runner)),
            responsible: (await GF.create_responsible(runner)),
            register_closed: false,
            register_treated: false,
            start_activity: false
        });

        const closing_result = await IS.close_incident(
            registering.data as Incident,
            await GF.create_responsible(runner)
        );

        expect(closing_result.success, closing_result.message).to.be.true;

        let IR = await IncidentsRepository.getRepository(runner);
        let incident = (await IR.findOne((registering.data as Incident).id));

        let result = await OwnershipClosingReport.send(incident);
        expect(result.success).to.be.true;
    });
})