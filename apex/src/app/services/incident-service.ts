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

  constructor(public payload: LightIncident[]) {

  } 
}

export class GenericIncidentAction {  
  constructor(public type: string, public payload: LightIncident) {

  } 
}

export class IncidentRescheduledAction {
  public type = INCIDENT_RESCHEDULED;

  constructor(public original:LightIncident, public new_incident: LightIncident) {

  } 
}

export type IncidentAction = IncidentAddedAction                             
                            | IncidentRescheduledAction
                            | GenericIncidentAction;

@Injectable()
export class IncidentService {
  private dataUrl = environment.api_url;    

  private incidents_actions = new Subject<IncidentAction>();
  incidentsActions$ = this.incidents_actions.asObservable();
    
  constructor(private http: HttpClient,
    private utilsService: UtilsService) { 

  }  

  emit_event(data : { type: string, data: string }[]) {
    data.forEach(dt => {
      switch (dt.type) {
        case INCIDENT_ADDED:                    
          this.incidents_actions.next(
            new IncidentAddedAction(
              JSON.parse(dt.data)
            )
          );      
          break;
        case INCIDENT_RESCHEDULED:
          let incidents = JSON.parse(dt.data);
          this.incidents_actions.next(            
            new IncidentRescheduledAction(
              incidents[0], incidents[1]
            )
          );      
          break;
        case INCIDENT_STARTED: 
        case INCIDENT_ENDED: 
        case INCIDENT_CHANGED: 
        case INCIDENT_CANCELLED: 
          this.incidents_actions.next(
            new GenericIncidentAction(
              dt.type, JSON.parse(dt.data)
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
      id: incident.id,
      close_description: incident.close_text
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

