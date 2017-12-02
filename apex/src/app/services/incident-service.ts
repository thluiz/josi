import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class IncidentService {
constructor(private http:Http) { }
  private dataUrl = 'https://myvtmiim.azurewebsites.net/api';
  
}

