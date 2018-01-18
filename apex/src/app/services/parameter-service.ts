import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ParameterService {
    private dataUrl = environment.api_url;  
    constructor(private http:Http) { }  

    getActiveBranches() {
        return this.http.get(this.dataUrl + `/branches`);
    }

    getIncidentTypes() {
        return this.http.get(this.dataUrl + `/incident_types`);
    }
}