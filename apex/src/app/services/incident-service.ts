import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { Subject }    from 'rxjs';

import { Result } from 'app/shared/models/result';
import { LightIncident } from 'app/shared/models/incident-model';

import { HttpService } from './http-service';
import { Ownership } from '../shared/models/ownership';

export const INCIDENT_ACTION_PREFIX = "INCIDENT_";
export const INCIDENT_ADDED = INCIDENT_ACTION_PREFIX + "ADDED";
export const INCIDENT_STARTED = INCIDENT_ACTION_PREFIX + "STARTED";
export const INCIDENT_CHANGED = INCIDENT_ACTION_PREFIX + "CHANGED";
export const INCIDENT_TREATED = INCIDENT_ACTION_PREFIX + "TREATED";
export const INCIDENT_ENDED = INCIDENT_ACTION_PREFIX + "ENDED";
export const INCIDENT_CANCELLED = INCIDENT_ACTION_PREFIX + "CANCELLED";
export const INCIDENT_RESCHEDULED = INCIDENT_ACTION_PREFIX + "RESCHEDULED";
export const INCIDENT_COMMENT_ADDED = INCIDENT_ACTION_PREFIX + "COMMENT_ADDED";
export const INCIDENT_COMMENT_ARCHIVED = INCIDENT_ACTION_PREFIX + "COMMENT_ARCHIVED";

export const OWNERSHIP_MIGRATED = "OWNERSHIP_MIGRATED";

@Injectable()
export class IncidentService {
  constructor(private http: HttpService) {

  }

  migrateOwnership(ownership: Ownership, incidents_to_migrate: LightIncident[]) {
    console.log(incidents_to_migrate);
    return this.http
    .post_and_emit('/ownerships/migrate', {
      ownership,
      incidents: incidents_to_migrate.map(i => { return { id: i.id } })
    });
  }

  getSumary(branch, month, week, date) {
    return this.http
    .get(`/sumary/${branch}/${month}/${week}/${date}`);
  }

  getAvailableOwnerships(branch, date, type) {
    return this.http
    .get(`/available_ownerships/${branch}/${date}/${type}`);
  }


  getIncidentDetails(incident_id) {
    return this.http
    .get(`/incidents/${incident_id}`);
  }

  getCurrentActivities(branch) {
    return this.http
    .get(`/current_activities/${branch}`);
  }

  getIncidentsWithoutOwnership(branch_id :number,
    location_id : number, start_date : string, end_date : string) {

      console.log(start_date, end_date);

    return this.http
      .get(`/incidents-without-ownership/${branch_id > 0 ? branch_id : 0}/${location_id > 0 ? location_id : 0}/${start_date}/${end_date}`);
  }

  close_incident(incident) {
    return this.http
    .post_and_emit<Result<LightIncident>>('/incident/close', {
      id: incident.id,
      close_text: incident.close_text,
      title: incident.title,
      payment_method_id: incident.payment_method_id,
      fund_value: incident.fund_value
    });
  }

  remove_incident(incident) {
    return this.http
    .post_and_emit('/incident/remove', {
      id: incident.id
    });
  }

  reschedule_incident(incident, new_incident, contact) {
    return this.http
    .post_and_emit('/incident/reschedule', {
      incident, new_incident, contact
    });
  }

  start_incident(incident) {
    return this.http
    .post_and_emit('/incident/start', {
      id: incident.id
    });
  }

  reopen_incident(incident) {
    return this.http
    .post_and_emit('/incident/reopen', {
      id: incident.id
    });
  }

  cancel_start_incident(incident) {
    return this.http
    .post_and_emit('/incident/start/cancel', {
      id: incident.id
    });
  }

  register_contact_for_incident(incident, contact) {
    return this.http
    .post_and_emit('/incident/register_contact', {
      incident, contact
    });
  }

  register_new_incident(incident) {
    return this.http
    .post_and_emit('/incident/register_incident', {
      incident
    });
  }

  getComments(incident_id) {
    return this.http
    .get(`/incident_comments/incident/${incident_id}`);
  }

  archiveComment(comment, incident) {
    return this.http
    .post_and_emit(`/incident_comments/archive`, {
      id: comment.id
    });
  }

  saveComment(incident, comment) {
    return this.http
    .post_and_emit('/incident_comments', {
      incident_id: incident.id,
      comment
    });
  }
}
