import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class IncidentService {
constructor(private http:Http) { }
  //private dataUrl = 'https://myvtmiim.azurewebsites.net/api';
  private dataUrl = 'http://localhost:3979/api';

  close_incident(incident) {
    return this.http.post(this.dataUrl + '/incident/close', { 
      incident
    });
  }

  reschedule_incident(incident, new_incident) {
    return this.http.post(this.dataUrl + '/incident/reschedule', { 
      incident, new_incident     
    });
  }

  register_contact_for_incident(incident, contact) {
    return this.http.post(this.dataUrl + '/incident/register_contact', { 
      incident, contact     
    });
  }
}

