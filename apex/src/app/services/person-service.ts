import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class PersonService {
constructor(private http:Http) { }
  private dataUrl = 'http://myvtmiim.azurewebsites.net/api';

  getDailyMonitor() {
    return this.http.get(this.dataUrl + '/daily');    
  }  
}

