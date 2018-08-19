import { isArray } from 'util';
import { ApplicationEventService } from './application-event-service';
import { Observable } from 'rxjs/Rx';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

import { HttpClient } from '@angular/common/http';
import { ParameterService } from './parameter-service';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { Result } from '../shared/models/result';

@Injectable()
export class FirebaseService {
    private dataUrl = environment.api_url;

    constructor(private afs: AngularFirestore,
      private afsec: AngularFireAuth,
      private eventManager: ApplicationEventService,
      private parameterService: ParameterService,
      private http: HttpClient
    ) {

      this.load_data(async (serverTime, token: string) => {
        let sign_in = await afsec.auth.signInWithCustomToken(token);

        this.listener_to_collection(serverTime.milliseconds,
            'incident-events', (dt) => {

              if(!isArray(dt) || dt.length <= 0) {
                return;
              }

              let result: Result = null;
              try {
                result = JSON.parse(dt[0].data);
              } catch (error) {
                result = Result.Fail(error);
              }
              (result as any).origin = "FIREBASE";
              this.eventManager.emit(result);
            }
        );

        this.listener_to_collection(serverTime.milliseconds,
          'people-events', (dt) => {

            if(!isArray(dt) || dt.length <= 0) {
              return;
            }

            console.log(dt);

            let result: Result = null;
            try {
              result = JSON.parse(dt[0].data);
            } catch (error) {
              result = Result.Fail(error);
            }
            (result as any).origin = "FIREBASE";
            this.eventManager.emit(result);
          }
      );

      });
    }

    private listener_to_collection(start_time, collection, emitter : (data : any ) => void) {
      this.afs
      .collection(collection, ref =>
        ref
        .where('time', '>', start_time)
        .orderBy("time", "desc")
        .limit(1)
      ).valueChanges()
      .subscribe((data) => {
        emitter(data as any);
      });
    }

    private load_data(fun : (serverTime : { date: string, milliseconds: number }, token: string) => void) {
      Observable.zip(
        this.getCurrentTime(),
        this.getFirebaseToken(),
        (server_time : { date: string, milliseconds: number },
          token : Result<string>
        ) => {
          fun(server_time, token.data);
        }
      ).subscribe();
    }

    private getFirebaseToken() {
      return this.http.get(this.dataUrl + '/firebase/token');
    }

    private getCurrentTime() {
      return this.http.get(this.dataUrl + '/firebase/current_time');
    }
}
