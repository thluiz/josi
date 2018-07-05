import {tap} from 'rxjs/operators';
import { UtilsService } from 'app/services/utils-service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs';
import { Result } from 'app/shared/models/result';

export enum Configurations {
    MinimalDirectIndicationsPerActiveMember = 1,
    MinimalIndirectIndicationsPerActiveMember = 2
}

@Injectable()
export class ParameterService {
   
    private dataUrl = environment.api_url;  
    
    private configuration$ = new ReplaySubject(1);

    private incident_types$ = new ReplaySubject(1);
    private contact_types$ = new ReplaySubject(1);
    private recurrence_types$ = new ReplaySubject(1);
    private kf_families$ = new ReplaySubject(1);
    private roles$ = new ReplaySubject(1);

    private branches$ = new ReplaySubject(1);
    private all_branches$ = new ReplaySubject(1);
    private programs$ = new ReplaySubject(1);    
    private domains$ = new ReplaySubject(1);
    private locations$ = new ReplaySubject(1);
    private group$ = new ReplaySubject(1);
    private countries$ = new ReplaySubject(1);
    private payment_methods$ = new ReplaySubject(1);
    private acquirers$ = new ReplaySubject(1);
    private products$ = new ReplaySubject(1);
    private currencies$ = new ReplaySubject(1);    
    private product_categories$ = new ReplaySubject(1);
    private relationship_types$ = new ReplaySubject(1);
    
    private personCardPositions$ = new ReplaySubject(1);
    private cardTemplates$ = new ReplaySubject(1);
    
    constructor(private http:HttpClient, private utilsService: UtilsService) { }  

    getTimeReloadComponents() {
        return 200;
    }

    getServerTime() {
        return this.http.get(this.dataUrl + `/current_time`);
    }

    getConfigurations(forceRefresh?: boolean) {        
        return this.utilsService.cache_results(this.configuration$, `/configurations`, forceRefresh);                      
    }

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

    getBranches(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.all_branches$, `/all_branches`, forceRefresh);                      
    }

    getBranch(id) {
        return this.http.get(this.dataUrl + `/branches/${id}`);
    }

    getBranchMap(branch_id) {
        return this.http.get(this.dataUrl + `/branch_maps/branch/${branch_id}`);
    }

    getBranchProducts(branch_id) {
        return this.http.get(this.dataUrl + `/branch_products/branch/${branch_id}`);
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

    getRelationshipTypes(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.relationship_types$, `/relationship_types`, forceRefresh);                      
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
    
    getCurrencies(forceRefresh?: boolean) {
        return this.utilsService.cache_results(this.currencies$, `/currencies`, forceRefresh);                      
    }
    
    getProductCategories(forceRefresh?: boolean) {        
        return this.utilsService.cache_results(this.product_categories$, `/product_categories`, forceRefresh);                      
    }

    getVoucher(id) {
        return this.http.get(this.dataUrl + `/vouchers/${id}`);        
    }

    getVouchers() {        
        return this.http.get(this.dataUrl + `/vouchers`);        
    }

    getBranchVouchers() {        
        return this.http.get(this.dataUrl + `/branch_vouchers`);        
    }

    remove_voucher_branch(branch, voucher) {
        return this.http.post(`${this.dataUrl}/parameters/voucher_branch/remove`, {
            branch, voucher 
        });
    }

    save_voucher_branch(branch, voucher) {
        return this.http.post(`${this.dataUrl}/parameters/voucher_branch/add`, {
            branch, voucher 
        });
    }
    saveBranch(branch) {
        return this.http
        .post(this.dataUrl + `/branches`, {
          branch
        }).pipe(tap((data : any) => {          
          this.getActiveBranches(true).subscribe();
        }));
    }

    associateBranchProduct(branch_product) {
        return this.http.post(this.dataUrl + `/branch_products`, branch_product);
    }
    
    saveBranchProduct(branch_id, branch_product) {
        return this.http.post(this.dataUrl + `/branch_products/${branch_id}`, branch_product);
    }

    archiveBranchProduct(product) {
        return this.http.post(this.dataUrl + `/branch_products/archive/${product.branch_id || 0 }`, product);
    }
    
    saveBranchMap(map) {
        return this.http.post(this.dataUrl + `/branch_maps`, map);
    }

    archiveMap(map)  {
        return this.http.post(this.dataUrl + `/branch_maps/archive`, map);
    }

    archiveProduct(product) {
        return this.http
        .post(this.dataUrl + `/products/archive`, {
            product 
        }).pipe(tap((data : any) => {      
          console.log("refreshing objects...")    
          this.getProducts(true).subscribe();
        }));
    }
    
    saveProduct(product) {        
        return this.http
        .post(this.dataUrl + `/products`, {
            product 
        }).pipe(tap((data : any) => {      
          console.log("refreshing objects...")    
          this.getProducts(true).subscribe();
        }));
    }

    savePaymentMethod(payment_method) {
        return this.http
        .post(this.dataUrl + `/payment_methods`, {
            payment_method
        }).pipe(tap((data : any) => {          
          this.getPaymentMethods(true).subscribe();
        }));
    }

    saveAcquirer(acquirer) {
        return this.http
        .post(this.dataUrl + `/acquirers`, {
            acquirer
        }).pipe(tap((data : any) => {          
            this.getAcquirers(true).subscribe();
        }));
    }

    saveCurrency(currency) {
        return this.http
        .post(this.dataUrl + `/currencies`, {
            currency
        }).pipe(tap((data : any) => {          
            this.getCurrencies(true).subscribe();
        }));
    }

    saveProductCategory(product_category) {
        return this.http
        .post(this.dataUrl + `/product_categories`, {
            product_category
        }).pipe(tap((data : any) => {          
            this.getProductCategories(true).subscribe();
        }));
    }
    
    saveVoucher(voucher) {
        return this.http
        .post(this.dataUrl + `/parameters/vouchers`, {
            voucher
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