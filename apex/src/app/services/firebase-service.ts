import { ParameterService } from 'app/services/parameter-service';
import { IncidentService } from 'app/services/incident-service';
import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class FirebaseService {            
    constructor(private afs: AngularFirestore,
      private incidentService: IncidentService,
      private parameterService: ParameterService
    ) {

      this.parameterService.getServerTime()
      .subscribe((server_time : { date: string, milliseconds: number }) => {        

        this.afs
        .collection('incident-events', ref => 
          ref
          .where('time', '>', server_time.milliseconds)
          .orderBy("time", "desc")
          .limit(1)
        ).valueChanges()
        .subscribe((data) => {          
          this.incidentService.emit_event(data as any);
        });

      });
    }
}