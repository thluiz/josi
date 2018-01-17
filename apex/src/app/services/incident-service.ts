import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class IncidentService {
  private dataUrl = environment.api_url;    

  private incident_added = new Subject<boolean>();
  private incident_changes = new Subject<boolean>();
  incidentAdd$ = this.incident_added.asObservable();  
  incidentsChanges$ = this.incident_changes.asObservable();

  constructor(private http:Http) { }  

  getSumary(branch, month, week, date) {
    return this.http.get(this.dataUrl + `/sumary/${branch}/${month}/${week}/${date}`);
  }

  close_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/close', { 
      incident
    }).do((next) => {            
      this.incident_changes.next(true);
    });
  }

  remove_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/remove', { 
      incident
    }).do((next) => {            
      this.incident_changes.next(true);
    });
  }

  reschedule_incident(incident, new_incident, contact) {
    return this.http.post(this.dataUrl + '/incident/reschedule', { 
      incident, new_incident, contact     
    }).do((next) => {            
      this.incident_changes.next(true);
    });
  }

  start_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/start', { 
      incident
    }).do((next) => {            
      this.incident_changes.next(true);
    });
  }

  register_contact_for_incident(incident, contact) {
    return this.http.post(this.dataUrl + '/incident/register_contact', { 
      incident, contact     
    }).do((next) => {            
      this.incident_changes.next(true);
    });
  }

  register_new_incident(incident) {    
    return this.http.post(this.dataUrl + '/incident/register_incident', { 
      incident     
    }).do((next) => {            
      this.incident_added.next(true);
    });    
  }
}

