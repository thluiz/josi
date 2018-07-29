require('dotenv').load();

import { QueryRunner } from 'typeorm';
import { Branch } from './../../entity/Branch';
import { Incident } from '../../entity/Incident';
import { IncidentType } from '../../entity/IncidentType';

export async function create(runner: QueryRunner, type : IncidentType,
    title = "Test", branch_id = 1) : Promise<Incident> {
    let BR = await runner.manager.getRepository<Branch>(Branch);

    let incident = new Incident();
    incident.type = type;
    incident.title = title;
    incident.date = new Date();
    incident.branch = (await BR.findOne(branch_id))

    return incident;
}