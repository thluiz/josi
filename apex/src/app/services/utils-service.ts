import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class UtilsService {
    constructor(private sanitizer: DomSanitizer) { }

    translate_date_to_server(date) {
        if(!date || !date.year)
            return null;

        return `${date.year}-${date.month}-${date.day}`;
    }

    sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }    
}

