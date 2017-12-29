import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';

@Injectable()
export class PersonService {
constructor(private http:Http) { }  
  private dataUrl = environment.api_url;  

  getDailyMonitor(branche, week) {
    return this.http.get(this.dataUrl + `/daily/${branche}/${week}`);    
  }  

  getAllData(id) {    
    return this.http
        .get(this.dataUrl + `/people/${id}`);
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
        .post(this.dataUrl + `/people_updater`, {
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
}

