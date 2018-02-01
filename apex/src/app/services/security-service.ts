import { UtilsService } from 'app/services/utils-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class SecurityService {
    private dataUrl = environment.api_url;  
    private current_user$ = new ReplaySubject(1);

    constructor(private http:HttpClient, private utilsService: UtilsService) {

    }
    
    getCurrentUserData() {                
        return  this.utilsService.cache_results(this.current_user$, `/users/current`);            
    }
}