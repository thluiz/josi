import { UtilsService } from 'app/services/utils-service';
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
    private locations$ = new ReplaySubject(1);
    private group$ = new ReplaySubject(1);
    private countries$ = new ReplaySubject(1);
    private payment_methods$ = new ReplaySubject(1);
    private acquirers$ = new ReplaySubject(1);
    private products$ = new ReplaySubject(1);
    
    private personCardPositions$ = new ReplaySubject(1);
    private cardTemplates$ = new ReplaySubject(1);
    
    constructor(private http:HttpClient, private utilsService: UtilsService) { }  

    getDomains(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.domains$, `/domains`, forceRefresh);                      
    }

    getPrograms(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.programs$, `/programs`, forceRefresh);                      
    }

    getProducts(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.products$, `/products`, forceRefresh);                      
    }
    
    getActiveBranches(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.branches$, `/branches`, forceRefresh);                      
    }

    getBranch(id) {
        return this.http.get(this.dataUrl + `/branches/${id}`);
    }

    getCountries(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.countries$, `/countries`, forceRefresh);                      
    }    
    
    getLocations(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.locations$, `/locations`, forceRefresh);                      
    }    

    getKungFuFamilies(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.kf_families$, `/kf_families`, forceRefresh);                      
    }

    getRoles(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.roles$, `/roles`, forceRefresh);                      
    }

    getRecurrenceTypes(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.recurrence_types$, `/recurrence_types`, forceRefresh);                      
    }

    getIncidentTypes(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.incident_types$, `/incident_types`, forceRefresh);        
    }

    getContactTypes(forceRefresh?: boolean) {        
        return this.utilsService.cache_results(this.contact_types$, `/contact_types`, forceRefresh);
    }

    getPersonCardPositions(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.personCardPositions$, `/person_card_positions`, forceRefresh);                      
    }

    getCardTemplates(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.cardTemplates$, `/card_templates`, forceRefresh);                      
    }

    getGroups(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.group$, `/groups`, forceRefresh);                      
    }    

    getPaymentMethods(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.payment_methods$, `/payment_methods`, forceRefresh);                      
    } 

    getAcquirers(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.acquirers$, `/acquirers`, forceRefresh);                      
    } 



    saveBranch(branch) {
        return this.http
        .post(this.dataUrl + `/branches`, {
          branch
        }).map((data : any) => {          
          this.getActiveBranches(true);
        });
    }

    saveProduct(product) {
        return this.http
        .post(this.dataUrl + `/products`, {
            product 
        }).map((data : any) => {          
          this.getProducts(true);
        });
    }

    savePaymentMethod(payment_method) {
        return this.http
        .post(this.dataUrl + `/payment_methods`, {
            payment_method
        }).map((data : any) => {          
          this.getPaymentMethods(true);
        });
    }

    saveAcquirer(acquirer) {
        return this.http
        .post(this.dataUrl + `/acquirers`, {
            acquirer
        }).map((data : any) => {          
          this.getAcquirers(true);
        });
    }

    ToggleAssociateBranchAcquirer(branch_id, acquirer_id) {
        return this.http
        .post(this.dataUrl + `/branches_acquirers`, {
            branch_id,
            acquirer_id
        });
    }
}