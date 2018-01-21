import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

export enum DailyMonitorDisplayType {
    Week = 0,
    Day = 1,
    Month = 2,
    Agenda = 3
}

@Injectable()
export class PersonService {  
 constructor(private http:Http) { }  
  private dataUrl = environment.api_url;    

  getDailyAgenda(branch, date: any) {
    return this.http.get(this.dataUrl + `/agenda/${branch || 0}/${date.year}-${date.month}-${date.day}`);    
  }

  getDailyMonitor(branch, display : DailyMonitorDisplayType, display_modifier: number) {
    return this.http.get(this.dataUrl + `/daily/${branch || 0}/${display}/${display_modifier}`);    
  }  

  getPeopleSummary(branche, week) {
    return this.http.get(this.dataUrl + `/people_summary/${branche || 0}/${week}`);    
  }  

  getMembersList() {
    return this.http.get(this.dataUrl + `/people/members`);    
  }

  getPeopleList() {
    return this.http.get(this.dataUrl + `/people`);    
  }

  getPersonContacts(person_id) {
    return this.http.get(this.dataUrl + `/person_contact/person/${person_id}`);    
  }

  savePersonContact(person_id, contact_type, contact, details) {
    return this.http.post(this.dataUrl + `/person_contact`, {
      person_id, 
      contact_type, 
      contact,
      details
    });    
  }

  removePersonContact(contact_id) {
    return this.http.post(this.dataUrl + `/person_contact/remove`, {
      contact_id
    });    
  }

  getData(id) {    
    return this.http
        .get(this.dataUrl + `/people/${id}`);
  }

  getPersonRoles(id) {    
    return this.http
        .get(this.dataUrl + `/person_role/person/${id}`);
  }

  getPersonScheduling(id) {    
    return this.http
        .get(this.dataUrl + `/person_schedule/person/${id}`);
  }

  addRole(person_id, role_id) {
    return this.http
        .post(this.dataUrl + `/person_role`, {
          person_id, role_id
        });
  }

  removeRole(person_id, role_id) {
    return this.http
        .post(this.dataUrl + `/person_role/delete`, {
          person_id, role_id
        });
  }

  savePersonData(person) {          
    return this.http
        .post(this.dataUrl + `/people`, {
          person
        });
  }
  
  saveKFName(person_id, kf_name, ideograms) {
    return this.http
        .post(this.dataUrl + `/people_alias/kf_name`, {
          person_id, 
          kf_name,
          ideograms
        });
  }

  search(term) {    
    return this.http
        .get(this.dataUrl + `/people/search/${term}`);
  }

  remove_schedule(schedule) {
    return this.http
        .post(this.dataUrl + `/person_schedule/delete`, {
          id: schedule.id
        });
  }

  save_schedule(schedule) {
    return this.http
        .post(this.dataUrl + `/person_schedule`, {
          schedule
        });
  }
}

