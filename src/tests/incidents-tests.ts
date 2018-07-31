require('dotenv').load();

import 'mocha';
import { QueryRunner, Repository } from 'typeorm';

import { IncidentsService, AddToOwnership, IncidentErrors, IOwnershipWithSupport } from '../services/incidents-service';
import * as IF from './factories/incident-factory';
import * as GF from './factories/general-factory';
import { DatabaseManager } from '../services/managers/database-manager';
import { expect } from 'chai';
import { Incident } from '../entity/Incident';
import { IncidentType } from '../entity/IncidentType';
import { Constants } from '../services/configurations-services';
import { ErrorResult, SuccessResult } from '../helpers/result';
import { IncidentsRepository } from '../repositories/incidents-repository';

describe('Incidents Tests', async function () {
    this.timeout(15000000);
    const dbm = new DatabaseManager();
    let runner: QueryRunner;
    let IS: IncidentsService;
    let ITR: Repository<IncidentType>;

    beforeEach(async () => {
        runner = await dbm.CreateQueryRunner();
        IS = new IncidentsService(dbm, { runner, useTransaction: true, shouldCommit: false });
        ITR = await runner.manager.getRepository<IncidentType>(IncidentType);

        await runner.startTransaction();
    })

    afterEach(async () => {
        await dbm.RollbackTransaction(runner);
    });

    describe('Create Incidents Tests', async function () {

        it('should create incident', async () => {
            let incident = await IF.create(runner, await ITR.findOne(1));
            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            });

            expect(registering.success, registering.data ?
                (registering.data as Error).message : "").to.be.true;
        });

        it('should create incident with people', async () => {
            let incident = await IF.create(runner, await ITR.findOne(1));
            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            });

            expect(registering.success, registering.data ?
                (registering.data as Error).message : "").to.be.true;

            expect(registering.data[0].people_incidents.length).to.be.eq(1);
        });

        it('should create incident in existing ownership', async () => {
            let type_ownership = await ITR.findOne(Constants.IncidentTypeOwnership);
            let ownership_data = await IF.create(runner, type_ownership);

            let ownership_register = await IS.create_ownership({
                incident: ownership_data,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: await GF.create_person(runner),
                new_support: await GF.create_person(runner)
            });

            expect(ownership_register.success, ownership_register.message).to.be.true;

            let ownership_and_support = ownership_register.data as IOwnershipWithSupport;
            expect(ownership_and_support.ownership.id).to.be.greaterThan(0);

            let type_requiring_ownership = await ITR.findOne({ require_ownership: true });
            let incident = await IF.create(runner, type_requiring_ownership);
            let people = [(await GF.create_person(runner)), (await GF.create_person(runner))];


            let registering = await IS.create_people_incidents({
                incident,
                people: people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                ownership: ownership_and_support.ownership,
                addToOwnership: AddToOwnership.AddToExistingOwnership,
            });

            expect(registering.success, registering.message).to.be.true;
            expect(registering.data[0].ownership.id).to.be.eq(ownership_and_support.ownership.id);
            expect(registering.data[1].ownership.id).to.be.eq(ownership_and_support.ownership.id);
        });

        it('should create one incident for each participant', async () => {
            let incident = await IF.create(runner, await ITR.findOne(1));
            let people = [(await GF.create_person(runner)), (await GF.create_person(runner))];
            let registering = await IS.create_people_incidents({
                incident,
                people: people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            });

            expect(registering.success, registering.data ?
                (registering.data as Error).message : "").to.be.true;

            expect((registering.data as Incident[]).length).to.be.eq(people.length);
        });

        it('should create incident with new ownership', async () => {
            let type_requiring_ownership = await ITR.findOne({ require_ownership: true });
            let incident = await IF.create(runner, type_requiring_ownership);
            let people = [(await GF.create_person(runner)), (await GF.create_person(runner))];

            let registering = await IS.create_people_incidents({
                incident,
                people: people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: (await GF.create_person(runner)),
                new_support: (await GF.create_person(runner)),
                addToOwnership: AddToOwnership.AddToNewOwnership,
            }) as SuccessResult<Incident[]>;

            expect(registering.success, registering.message).to.be.true;

            let ownership = registering.data.find(i => i.type.id === Constants.IncidentTypeOwnership);
            let support = registering.data.find(i => i.type.id === Constants.IncidentTypeSupport);
            let incidents = registering.data.filter(i => i.type.id !== Constants.IncidentTypeOwnership
                && i.type.id !== Constants.IncidentTypeSupport);

            expect(ownership.id).to.be.greaterThan(0);
            expect(support.id).to.be.greaterThan(0);
            expect(incidents.length)
                .to.be.equals(people.length,
                    "should return one incident for each participant");

            expect(incidents.length + 2)
                .to.be.equals(registering.data.length,
                    "should return one incident for each person and one ownership and one support");

            expect(incidents.filter(i => i.ownership.id == ownership.id).length)
                .to.be.equals(incidents.length,
                    "should return all incidents with the same ownership");
        });



        it('should not create incident without title if type require it', async () => {
            let type_requiring_title = await ITR.findOne({ require_title: true });
            let incident = await IF.create(runner, type_requiring_title);
            incident.title = "";

            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false;
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.TitleNeeded]);
        });

        it('should not create incident without ownership if type require it', async () => {
            let type_requiring_ownership = await ITR.findOne({ require_ownership: true });
            let incident = await IF.create(runner, type_requiring_ownership);

            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false;
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.MissingOwnership]);
        });

        it('should not create incident without ownership if type require it and new support has not been sent', async () => {
            let type_requiring_ownership = await ITR.findOne({ require_ownership: true });
            let incident = await IF.create(runner, type_requiring_ownership);

            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: (await GF.create_person(runner)),
                addToOwnership: AddToOwnership.AddToNewOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false;
            expect(registering.data.message)
                .to.be.eq(IncidentErrors[IncidentErrors.MissingOwnerOrSupport]);
        });

        it('should not create incident without ownership if type require it and new owner has not been sent', async () => {
            let type_requiring_ownership = await ITR.findOne({ require_ownership: true });
            let incident = await IF.create(runner, type_requiring_ownership);

            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.AddToNewOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false;
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.MissingOwnerOrSupport]);
        });

        it('should not create incident without ownership if type require it and new owner has not been sent', async () => {
            let type_requiring_ownership = await ITR.findOne({ require_ownership: true });
            let incident = await IF.create(runner, type_requiring_ownership);

            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.AddToExistingOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false;
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.MissingOwnership]);
        });

        it('should not create incident with new ownership sending as to add to existing ownership', async () => {
            let type_requiring_ownership = await ITR.findOne({ require_ownership: true });
            let incident = await IF.create(runner, type_requiring_ownership);
            let people = [(await GF.create_person(runner)), (await GF.create_person(runner))];

            let registering = await IS.create_people_incidents({
                incident,
                people: people,
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                new_owner: people[0],
                new_support: people[1],
                addToOwnership: AddToOwnership.AddToExistingOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false;
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.MissingOwnership]);
        });

        it('should not create incident without value if type require it', async () => {
            let type_requiring_value = await ITR.findOne({ need_value: true });
            let incident = await IF.create(runner, type_requiring_value);
            incident.value = 0;

            let registering = await IS.create_people_incidents({
                incident,
                people: [(await GF.create_person(runner))],
                responsible: (await GF.create_responsible(runner)),
                register_closed: false,
                register_treated: false,
                start_activity: false,
                addToOwnership: AddToOwnership.DoNotAddToOwnership,
            }) as ErrorResult;

            expect(registering.success).to.be.false;
            expect(registering.data.message).to.be.eq(IncidentErrors[IncidentErrors.ValueNeeded]);
        });
    });

    describe('Close Incidents Tests', async function() {
        it('should close incident', async () => {
            const incident_data = await IF.create(runner, await ITR.findOne(1));
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

            expect(incident.closed).to.be.true;
        });

        it('should close ownership', async () => {
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

            expect(incident.closed).to.be.true;
        });
    })
});
