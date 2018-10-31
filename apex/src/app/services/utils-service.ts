import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class UtilsService {
    private dataUrl = environment.api_url;

    constructor(private sanitizer: DomSanitizer, private http: HttpClient) { }

    current_date_in_seconds() {
      return new Date().getTime()/1000;
    }

    translate_date_to_server(date : NgbDateStruct) {
        if(!date || !date.year)
            return null;

        return `${date.year}-${date.month}-${date.day}`;
    }

    translate_date_time_to_server(date: NgbDateStruct, time : NgbTimeStruct) {
        if(!date || !date.year || !time)
            return null;

        return `${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}`;
    }

    sanitize(url:string){
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    translate_date_to_view(date) {
        if(!date || date.year > 0 || date.split("-").length != 3) {
            return null;
        }
        const splitted_date = date.split("-");

        if(splitted_date.length < 3) {
            return null;
        }

        return {
            year: parseInt(splitted_date[0], 10),
            month: parseInt(splitted_date[1], 10),
            day: parseInt(splitted_date[2], 10)
        }
    }

    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
          const key = keyGetter(item);
          const collection = map.get(key);
          if (!collection) {
              map.set(key, [item]);
          } else {
              collection.push(item);
          }
      });
      return map;
    }

    translate_time_to_view(date) {
        if(!date || date.year > 0 || date.split("-").length != 3 || date.split("T").length != 2) {
            return null;
        }
        const splitted_date = date.split("T");
        const time = splitted_date[1].split(":");

        if(time.length < 2) {
            return null;
        }

        return {
            hour: parseInt(time[0], 10),
            minute: parseInt(time[1], 10),
            second: 0
        }
    }

    cache_results(observable : ReplaySubject<any>, endpoint:string, forceRefresh?: boolean) {
        if(observable.observers.length > 1) {
          observable.observers = [ observable.observers[0] ];
        }
        if (!observable.observers.length || forceRefresh) {
            this.http.get(this.dataUrl + endpoint)
            .subscribe(
                data => {
                  observable.next(data);
                },
                error => {
                    console.log(error);
                    observable.error(error);
                    // Recreate the Observable as after Error we cannot emit data anymore
                    observable = new ReplaySubject(1);
                }
            );
        }

        return observable;
    }
}
