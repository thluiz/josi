import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';

@Injectable()
export class SecurityService {
    private dataUrl = environment.api_url;  

    constructor(private http:HttpClient) {

    }
    
    getCurrentUserData(user_id) {        
        return this.http.get(this.dataUrl + `/users/current`);            
    }
}