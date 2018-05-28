import {tap, map} from 'rxjs/operators';
import { FirebaseService } from './firebase-service';
import { UtilsService } from './utils-service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs';
import { Result } from 'app/shared/models/result';
import { LightIncident } from 'app/shared/models/incident-model';

export const INCIDENT_ADDED = "INCIDENT_ADDED";
export const INCIDENT_STARTED = "INCIDENT_STARTED";
export const INCIDENT_CHANGED = "INCIDENT_CHANGED";
export const INCIDENT_TREATED = "INCIDENT_TREATED";
export const INCIDENT_ENDED = "INCIDENT_ENDED";
export const INCIDENT_CANCELLED = "INCIDENT_CANCELLED";
export const INCIDENT_RESCHEDULED = "INCIDENT_RESCHEDULED";

export class IncidentAddedAction {
  public type = INCIDENT_ADDED;

  constructor(public payload: LightIncident) {

  } 
}

export class IncidentTreatedAction {
  public type = INCIDENT_TREATED;

  constructor(public payload: LightIncident) {

  } 
}

export class IncidentCancelledAction {
  public type = INCIDENT_CANCELLED;

  constructor(public payload: LightIncident) {

  } 
}

export class IncidentRescheduledAction {
  public type = INCIDENT_RESCHEDULED;

  constructor(public payload: LightIncident) {

  } 
}

export class IncidentStartedAction {
  public type = INCIDENT_STARTED;

  constructor(public payload: LightIncident) {

  } 
}

export class IncidentEndedAction {
  public type = INCIDENT_ENDED;

  constructor(public payload: LightIncident) {

  } 
}

export class IncidentChangedAction {
  public type = INCIDENT_CHANGED;

  constructor(public payload: LightIncident) {

  } 
}

export type IncidentAction = IncidentAddedAction 
                            | IncidentStartedAction 
                            | IncidentChangedAction
                            | IncidentRescheduledAction
                            | IncidentTreatedAction 
                            | IncidentCancelledAction
                            | IncidentEndedAction;

@Injectable()
export class IncidentService {
  private dataUrl = environment.api_url;    

  private incidents_actions = new Subject<IncidentAction>();
  incidentsActions$ = this.incidents_actions.asObservable();
    
  constructor(private http: HttpClient,
    private utilsService: UtilsService) { 

  }  

  emit_event(data : { event_type: string, data: string }[]) {
    data.forEach(dt => {
      switch (dt.event_type) {
        case INCIDENT_ADDED:                    
          this.incidents_actions.next(
            new IncidentAddedAction(
              JSON.parse(dt.data)
            )
          );      
          break;
        case INCIDENT_STARTED: 
          this.incidents_actions.next(
            new IncidentStartedAction(
              JSON.parse(dt.data)
          ));      
          break;
        case INCIDENT_ENDED: 
          this.incidents_actions.next(
            new IncidentEndedAction(
              JSON.parse(dt.data)
          ));      
          break;
        case INCIDENT_CHANGED: 
          this.incidents_actions.next(
            new IncidentChangedAction(
              JSON.parse(dt.data)
          ));      
          break; 
        case INCIDENT_CANCELLED: 
          this.incidents_actions.next(
            new IncidentCancelledAction(
              JSON.parse(dt.data)
          ));      
          break;          
      }
    });    
  }

  getSumary(branch, month, week, date) {
    return this.http.get(this.dataUrl + `/sumary/${branch}/${month}/${week}/${date}`);
  }

  getIncidentDetails(incident_id) {
    return this.http.get(this.dataUrl + `/incidents/${incident_id}`);
  }

  getCurrentActivities(branch) {
    let date = new Date();    

    return this.http.get(this.dataUrl + `/current_activities/${branch}`);
  }

  close_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/close', { 
      id: incident.id
    })
  }

  remove_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/remove', { 
      id: incident.id
    });
  }

  reschedule_incident(incident, new_incident, contact) {
    return this.http.post(this.dataUrl + '/incident/reschedule', { 
      incident, new_incident, contact     
    });
  }

  start_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/start', { 
      id: incident.id
    });
  }

  reopen_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/reopen', { 
      id: incident.id
    });
  }

  cancel_start_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/start/cancel', { 
      id: incident.id
    });
  }

  register_contact_for_incident(incident, contact) {
    return this.http.post(this.dataUrl + '/incident/register_contact', { 
      incident, contact     
    });
  }

  register_new_incident(incident) {    
    return this.http.post(this.dataUrl + '/incident/register_incident', { 
      incident     
    });    
  }
  
  getComments(incident_id) {
    return this.http.get(this.dataUrl + `/incident_comments/incident/${incident_id}`); 
  }

  archiveComment(comment, incident) {
    return this.http.post(this.dataUrl + `/incident_comments/archive`, {
      id: comment.id
    });
  }

  saveComment(incident, comment) {    
    return this.http
            .post(this.dataUrl + `/incident_comments`, {
              incident_id: incident.id,
              comment
            });
  }
}

