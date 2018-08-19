
import {forkJoin as observableForkJoin,  Subject } from 'rxjs';

import {map, tap} from 'rxjs/operators';
import { Card } from 'app/shared/models/card.model';
import { UtilsService } from './utils-service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { CardCommentary } from 'app/shared/models/card-commentary.model';
import { CardStep } from 'app/shared/models/card-step.model';
import { Result } from 'app/shared/models/result';

export const CARD_ADDED = "CARD_ADDED"
export const CARD_CHANGED = "CARD_CHANGED"
export const CARD_COMMENT_ADDED = "CARD_COMMENT_ADDED";
export const CARD_ARCHIVED = "CARD_ARCHIVED";
export const CARD_MOVED = "CARD_MOVED";

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

export class CardArchivedAction {
  public type = CARD_ARCHIVED;

  constructor(public payload: Card) {

  }
}

export class CardMovedAction {
  public type = CARD_MOVED;

  constructor(public payload:  {  card: Card, old_parent_id: number, new_parent_id: number }) {

  }
}

export class CardCommentAddedAction {
  public type = CARD_COMMENT_ADDED;

  constructor(public payload: {card: Card, commentaries: CardCommentary[] }) {

  }
}

export type CardAction = CardAddedAction | CardChangedAction |
                          CardCommentAddedAction | CardArchivedAction | CardMovedAction;

@Injectable()
export class CardService {
  private dataUrl = environment.api_url;

  private organizations$ = new ReplaySubject(1);

  private card_changes = new Subject<CardAction>();
  cardChanges$  = this.card_changes.asObservable();
  private operators$ = new ReplaySubject(1);

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  saveCard(card : Card) {
    let clone = JSON.parse(JSON.stringify(card));
    clone.parent.childrens = null;
    clone.parent.steps = null
    clone.parent.steps_description = null;

    return this.http.post(this.dataUrl + `/cards`, { card: clone }).pipe(
    tap((result : Result<Card[]>) => this.card_changes.next(new CardAddedAction(result.data[0]))));
  }

  updateCard(card : Card) {
    return this.http.post(this.dataUrl + `/cards`, { card: card }).pipe(
    tap((result : Result<Card[]>) => this.card_changes.next(new CardChangedAction(result.data[0]))));
  }

  archiveCard(card : Card) {
    return this.http.post(this.dataUrl + `/archive_card`, { card: card }).pipe(
    tap((result : Result<Card[]>) => this.card_changes.next(new CardArchivedAction(result.data[0]))));
  }

  saveCardStep(card_id: number, step_id: number) {
    return this.http.post(this.dataUrl + `/cards/steps`, { card_id, step_id }).pipe(
    tap((result : Result<Card[]>) => this.card_changes.next(new CardChangedAction(result.data[0]))));
  }

  getCardData(id) {
    return this.http.get(this.dataUrl + `/cards/${id}`);
  }

  getOrganizations(include_childrens = false) {
    const url = `/organizations/0/${include_childrens? 1 : 0}`;
    return this.http.get(this.dataUrl + url);
  }

  getCachedOrganizations(include_childrens = false, forceRefresh = false) {
    const url = `/organizations/0/${include_childrens? 1 : 0}`;

    return this.utilsService.cache_results(this.organizations$, url, forceRefresh);
  }

  getOrganization(id, include_childrens = false) {
    return this.http.get(this.dataUrl + `/organizations/${id}/${include_childrens? 1 : 0}`);
  }

  getFlatOrganizationsData() {
    return this.http.get(this.dataUrl + `/organizations/flat`);
  }

  getProject(id) {
    return this.http.get(this.dataUrl + `/projects/${id}`)
    .pipe(map((result_project : Result<Card[]>) => {
      const project = result_project.data[0];

      if(!project.childrens || project.childrens.length < 0) {
        project.childrens = [];
      }
      project.steps = project.steps_description.map((step_description) => {
        let step : CardStep = {
          id: step_description.id,
          name: step_description.name,
          childrens: [],
          order: step_description.order,
          automatically_move: step_description.automatically_move
        };

        step.childrens = project.childrens.filter(ch => ch.current_step_id == step.id);

        return step;
      });

      project.childrens = project.childrens.filter(ch => !ch.current_step_id);

      return Result.Ok(project);
    }));
  }

  getOperators(forceRefresh = false) {
    return this.utilsService.cache_results(this.operators$, `/operators`, forceRefresh);
  }

  saveOperator(card_id, person_id) {
    return this.http.post(this.dataUrl + `/person_cards`, { person_card: {
      card_id,
      person_id
    }});
  }

  moveCard(card: Card, parent_id, step_id) {
    return this.http.post(this.dataUrl + `/move_card`, {
      card_id: card.id, parent_id, step_id
    }).pipe(
    tap((result_data: Result<Card>) => {
      var old_parent_id = card.parent_id;
      var result = result_data.data;

      this.card_changes.next(new CardMovedAction({ card: result, old_parent_id, new_parent_id: card.parent_id }));
    }));
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

    return observableForkJoin(requests);
  }

  saveProjectStepOrder(child_ordering : {card_id:number, order: number}[]) {
    let requests = [];
    for(var i = 0; i < child_ordering.length; i++) {
      requests[requests.length] = this.http.post(this.dataUrl + `/cards/steps/card_order`, child_ordering[i]);
    }

    return observableForkJoin(requests);
  }

  saveComment(card: Card, comment: string, commentary_type) {
    card.comment_count++;

    let clone = JSON.parse(JSON.stringify(card));
    clone.parent.childrens = null;
    clone.parent.steps = null
    clone.parent.steps_description = null;
    clone.childrens = null;
    clone.steps = null;
    clone.steps_description = null;

    return this.http.post(this.dataUrl + `/cards_comments`, { card: clone, comment, commentary_type }).pipe(
    tap((result_data : Result<CardCommentary[]>) => this.card_changes.next(
      new CardCommentAddedAction({card: card, commentaries: result_data.data}))
    ));
  }

  getCardCommentaries(card: Card) {
    return this.http.get(this.dataUrl + `/cards_comments/${card.id}`);
  }

}
