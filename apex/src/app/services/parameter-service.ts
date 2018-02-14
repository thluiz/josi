import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ParameterService {
    private dataUrl = environment.api_url;  
    
    private incident_types$ = new ReplaySubject(1);
    private contact_types$ = new ReplaySubject(1);
    private recurrence_types$ = new ReplaySubject(1);
    private kf_families$ = new ReplaySubject(1);
    private roles$ = new ReplaySubject(1);

    private branches$ = new ReplaySubject(1);
    private programs$ = new ReplaySubject(1);
    private domains$ = new ReplaySubject(1);
    
    private personCardPositions$ = new ReplaySubject(1);
    private cardTemplates$ = new ReplaySubject(1);
    
    constructor(private http:HttpClient) { }  

    getDomains(forceRefresh?: boolean) {
        return this.cache_results(this.domains$, `/domains`, forceRefresh);                      
    }

    getPrograms(forceRefresh?: boolean) {
        return this.cache_results(this.programs$, `/programs`, forceRefresh);                      
    }

    getActiveBranches(forceRefresh?: boolean) {
        return this.cache_results(this.branches$, `/branches`, forceRefresh);                      
    }

    getKungFuFamilies(forceRefresh?: boolean) {
        return this.cache_results(this.kf_families$, `/kf_families`, forceRefresh);                      
    }

    getRoles(forceRefresh?: boolean) {
        return this.cache_results(this.roles$, `/roles`, forceRefresh);                      
    }

    getRecurrenceTypes(forceRefresh?: boolean) {
        return this.cache_results(this.recurrence_types$, `/recurrence_types`, forceRefresh);                      
    }

    getIncidentTypes(forceRefresh?: boolean) {
        return this.cache_results(this.incident_types$, `/incident_types`, forceRefresh);        
    }

    getContactTypes(forceRefresh?: boolean) {        
        return this.cache_results(this.contact_types$, `/contact_types`, forceRefresh);
    }

    getPersonCardPositions(forceRefresh?: boolean) {
        return this.cache_results(this.personCardPositions$, `/person_card_positions`, forceRefresh);                      
    }

    getCardTemplates(forceRefresh?: boolean) {
        return this.cache_results(this.cardTemplates$, `/card_templates`, forceRefresh);                      
    }
    

    private cache_results(observable : ReplaySubject<any>, endpoint:string, forceRefresh?: boolean) {
        if (!observable.observers.length || forceRefresh) {
            this.http.get(this.dataUrl + endpoint)
            .subscribe(
                data => observable.next(data),
                error => {
                    observable.error(error);
                    // Recreate the Observable as after Error we cannot emit data anymore
                    observable = new ReplaySubject(1);
                }
            );
        }

        return observable;
    }
}