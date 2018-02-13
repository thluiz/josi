import { UtilsService } from './utils-service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class CardService {
  private dataUrl = environment.api_url;    

  private comment_changes = new Subject<any>();
  commentChanges$  = this.comment_changes.asObservable();  

  constructor(private http: HttpClient, private utilsService: UtilsService) { }  

  getOrganizations() {
    return this.http.get(this.dataUrl + `/organizations`);
  }
  
  getOrganization(id) {
    return this.http.get(this.dataUrl + `/organizations/${id}`);
  }

  getOperators() {
    return this.http.get(this.dataUrl + `/operators`);
  }

  saveOperator(card_id, person_id) {
    return this.http.post(this.dataUrl + `/person_cards`, { person_card: {
      card_id,
      person_id
    }});
  }

  removeOperator(card_id, person_id) {
    return this.http.post(this.dataUrl + `/person_cards/delete`, { person_card: {
      card_id,
      person_id
    }});
  }

  saveOrganizationChart(id, chart: [{person_id: number, position: number, position_description: string}]) {
    let requests = [];
    for(var i = 0; i < chart.length; i++) {
      let current_person = chart[i];
      let person_card = { person_card : {
          card_id: id,
          person_id: current_person.person_id,
          position_id: current_person.position,
          position_description: current_person.position_description,
          order: i
        }
      }

      requests[requests.length] = this.http.post(this.dataUrl + `/person_cards/`, person_card);
    }

    return Observable.forkJoin(requests);
  }

}

