import { Card } from 'app/shared/models/card.model';
import { UtilsService } from './utils-service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs/Subject';

export const CARD_ADDED = "CARD_ADDED"
export const CARD_CHANGED = "CARD_CHANGED"

export class CardAddedAction {
  public type = CARD_ADDED;

  constructor(public payload: Card) {

  } 
}

export class CardChangedAction {
  public type = CARD_CHANGED;

  constructor(public payload: Card) {

  } 
}

export type CardAction = CardAddedAction | CardChangedAction;

@Injectable()
export class CardService {
  saveCardStep(card_id: number, step_id: number) {
    return this.http.post(this.dataUrl + `/cards/steps`, { card_id, step_id })
    .do((data : Card) => this.card_changes.next(new CardChangedAction(data)));
  }
  private dataUrl = environment.api_url;    

  private card_changes = new Subject<CardAction>();
  commentChanges$  = this.card_changes.asObservable();  

  constructor(private http: HttpClient, private utilsService: UtilsService) { }  

  saveCard(card : Card) {
    return this.http.post(this.dataUrl + `/cards`, { card: card })
    .do((data : Card) => this.card_changes.next(new CardAddedAction(data[0])));
  }

  getOrganizations(include_childrens = false) {
    return this.http.get(this.dataUrl + `/organizations/0/${include_childrens? 1 : 0}`);
  }
  
  getOrganization(id, include_childrens = false) {
    return this.http.get(this.dataUrl + `/organizations/${id}/${include_childrens? 1 : 0}`);
  }

  getProject(id) {
    return this.http.get(this.dataUrl + `/projects/${id}`).map((data : Card) => {
      let project = data;
      if(!project.steps) {
        project.steps = [];
      }

      project.steps = project.steps.map((step) => {
        if(!step.childrens) {
          step.childrens = [];
        }

        return step;
      });

      return project;
    });
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

