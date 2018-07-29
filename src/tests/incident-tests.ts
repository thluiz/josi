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

describe('Incidents Tests', async function() {
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

    it('should create incident', async () => {
        let incident = await IF.create(runner, await ITR.findOne(1));
        let registering = await IS.register_incident2({
            incident,
            people: [(await GF.create_person(runner))],
            responsible: (await GF.create_responsible(runner)),
            register_closed: false,
            register_treated: false,
            start_activity: false,
            addToOwnership: AddToOwnership.DoNotAddToOwnership,
        });

        expect(registering.success, registering.error ?
            registering.error.message : "").to.be.true;
    });

    it('should create incident with people', async () => {
        let incident = await IF.create(runner, await ITR.findOne(1));
        let registering = await IS.register_incident2({
            incident,
            people: [(await GF.create_person(runner))],
            responsible: (await GF.create_responsible(runner)),
            register_closed: false,
            register_treated: false,
            start_activity: false,
            addToOwnership: AddToOwnership.DoNotAddToOwnership,
        });

        expect(registering.success, registering.error ?
            registering.error.message : "").to.be.true;

        let ir = runner.manager.getRepository<Incident>(Incident);
        let result = await ir.findOne(incident.id, {
            relations: ["people_incidents"]
        });
        console.log(result);

        expect(result.people_incidents.length).to.be.eq(1);
    });

    it('should block incident without title if type require title', async () => {
        let type_requiring_title = await ITR.findOne({ require_title: true});
        let incident = await IF.create(runner, type_requiring_title);
        incident.title = "";

        let registering = await IS.register_incident2({
            incident,
            people: [(await GF.create_person(runner))],
            responsible: (await GF.create_responsible(runner)),
            register_closed: false,
            register_treated: false,
            start_activity: false,
            addToOwnership: AddToOwnership.DoNotAddToOwnership,
        });

        expect(registering.success).to.be.false;
        expect(registering.error.message).to.be.eq(IncidentErrors[IncidentErrors.TitleNeeded]);
    });

    it('should block incident without value if type need value', async () => {
        let type_requiring_value = await ITR.findOne({ need_value: true});
        let incident = await IF.create(runner, type_requiring_value);
        incident.value = 0;

        let registering = await IS.register_incident2({
            incident,
            people: [(await GF.create_person(runner))],
            responsible: (await GF.create_responsible(runner)),
            register_closed: false,
            register_treated: false,
            start_activity: false,
            addToOwnership: AddToOwnership.DoNotAddToOwnership,
        });

        expect(registering.success).to.be.false;
        expect(registering.error.message).to.be.eq(IncidentErrors[IncidentErrors.ValueNeeded]);
    });
});