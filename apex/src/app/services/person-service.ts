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

  search(term) {    
    return this.http
        .get(this.dataUrl + `/people/search/${term}`);
  }
}

