import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UtilsService {
    private dataUrl = environment.api_url;    

    constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

    translate_date_to_server(date) {
        if(!date || !date.year)
            return null;

        return `${date.year}-${date.month}-${date.day}`;
    }

    translate_date_time_to_server(date, time) {        
        if(!date || !date.year || !time)
            return null;

        return `${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}`;
    }

    sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }    

    translate_date_to_view(date) {      
        if(!date || date.split("-").length != 3) {
            return null;
        }
        const splitted_date = date.split("-");

        return {
            year: parseInt(splitted_date[0], 10),
            month: parseInt(splitted_date[1], 10),
            day: parseInt(splitted_date[2], 10)
        }
    }

    translate_time_to_view(date) {      
        if(!date || date.split("-").length != 3 || date.split("T").length != 2) {
            return null;
        }
        const splitted_date = date.split("T");
        const time = splitted_date[1].split(":");

        return {
            hour: parseInt(time[0], 10),
            minute: parseInt(time[1], 10),
            second: 0
        }
    }

    cache_results(observable : ReplaySubject<any>, endpoint:string, forceRefresh?: boolean) {
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

