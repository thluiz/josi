import { ApplicationEventService } from './application-event-service';
import { Observable } from 'rxjs/Rx';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { HttpClient } from '@angular/common/http';
import { ParameterService } from 'app/services/parameter-service';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Result } from 'app/shared/models/result';

@Injectable()
export class HttpService {
    private dataUrl = environment.api_url;

    constructor(
      private http: HttpClient,
      private eventManager: ApplicationEventService
    ) {

    }

    get(method) {
        return this.http.get(this.dataUrl + method);
    }

    post_and_emit<T>(method, data) : Observable<Result<T>> {
        return  this.http.post<Result<T>>(this.dataUrl + method, data)
        .do<Result<T>>((next: Result<T>) => {
            console.log(next);
            this.eventManager.emit(next);
        });
    }
}