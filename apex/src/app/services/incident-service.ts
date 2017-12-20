import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class IncidentService {
constructor(private http:Http) { }
  private dataUrl = environment.api_url;    

  close_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/close', { 
      incident
    });
  }

  remove_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/remove', { 
      incident
    });
  }

  reschedule_incident(incident, new_incident, contact) {
    return this.http.post(this.dataUrl + '/incident/reschedule', { 
      incident, new_incident, contact     
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
}

