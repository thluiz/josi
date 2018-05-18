import { IContact } from './person-service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/Subject';

export enum DailyMonitorDisplayType {
    Week = 0,
    Day = 1,
    Month = 2,
    Agenda = 3,
    Current = 4
}

export interface IContact {
  person_id: number;
  contact_type :number;
  contact :string;
  details :string;
}

export interface IIndication {
  person_id: number;
  person2_id: number;      
}

export enum PersonActions {
  ADD,
  ADD_ADDRESS,
  ARCHIVE_ADDRESS
}

export interface IPersonEvent {
  type: PersonActions,
  data: any
}

@Injectable()
export class PersonService {  
  private dataUrl = environment.api_url;    

  private contact_changes = new Subject<IContact>();
  contactChanges$ = this.contact_changes.asObservable();  

  private person_changes = new Subject<any>();
  personChanges$  = this.person_changes.asObservable();  

  private comment_changes = new Subject<any>();
  commentChanges$  = this.comment_changes.asObservable();  

  private person_actions = new Subject<IPersonEvent>();
  personActions$  = this.person_actions.asObservable();

  private indication_actions = new Subject<IIndication>();
  indicationChanges$  = this.indication_actions.asObservable();
  
  private partnership_actions = new Subject<IIndication>();
  partnershipChanges$  = this.partnership_actions.asObservable();

  private external_unit_actions = new Subject<IIndication>();
  externalUnitChanges$  = this.external_unit_actions.asObservable();

  constructor(private http:HttpClient) { }  
  
  getDailyAgenda(branch, date: any) {
    return this.http.get(this.dataUrl + `/agenda/${branch || 0}/${date.year}-${date.month}-${date.day}`);    
  }

  getDailyMonitor(branch, display : DailyMonitorDisplayType, display_modifier: number) {
    return this.http.get(this.dataUrl + `/daily/${branch || 0}/${display}/${display_modifier}`);    
  }  

  getPeopleSummary(branche, week) {
    return this.http.get(this.dataUrl + `/people_summary/${branche || 0}/${week}`);    
  }  

  getMembersList() {
    return this.http.get(this.dataUrl + `/people/members`);    
  }

  getInterestedList(branch, name) {    
    return this.http.get(this.dataUrl + `/interested?branch=${branch || 0}&name=${name || ""}`);    
  }

  getInvitedPeopleList(branch, name, voucher) {    
    return this.http.get(this.dataUrl + `/invited_people?branch=${branch || 0}&name=${name || ""}&voucher=${voucher || 0}`);    
  }

  getPeopleAwayList(branch, name) {    
    return this.http.get(this.dataUrl + `/people-away?branch=${branch || 0}&name=${name || ""}`);    
  }

  getServiceProvidersList(branch, name) {    
    return this.http.get(this.dataUrl + `/service-providers?branch=${branch || 0}&name=${name || ""}`);    
  }

  getPeopleList() {
    return this.http.get(this.dataUrl + `/people`);    
  }

  getPersonContacts(person_id, only_principal = false) {
    return this.http.get(this.dataUrl + `/person_contact/person/${person_id}/${only_principal ? 1 : 0}`);    
  }

  
  getPersonPartnerships(person_id) {
    return this.http.get(this.dataUrl + `/person_partnerships/person/${person_id}`);    
  }

  getPersonExternalUnits(person_id) {
    return this.http.get(this.dataUrl + `/person_external_units/person/${person_id}`);    
  }
      
  getPersonRelationships(person_id) {
    return this.http.get(this.dataUrl + `/relationships/person/${person_id}`);    
  }

  getPersonIndications(person_id) {
    return this.http.get(this.dataUrl + `/person_indications/person/${person_id}`);    
  }

  getPendingCommunication(person_id) {
    return this.http.get(this.dataUrl + `/person_communication/pending/${person_id}`);    
  }

  getPendingFinancial(person_id) {
    return this.http.get(this.dataUrl + `/person_financial/pending/${person_id}`);    
  }
  
  getPendingSchedule(person_id) {
    return this.http.get(this.dataUrl + `/person_schedule/pending/${person_id}`);    
  }

  getPersonMissingData(person_id) {
    return this.http.get(this.dataUrl + `/person/missing_data/${person_id}`);    
  }

  saveIndication(indication) {
    return this.http.post(this.dataUrl + `/person_indications`, { indication }).do((d) => {
      this.indication_actions.next(indication);
    });    
  }

  changeIndicationType(indication, new_type) {
    return this.http.post(this.dataUrl + `/invitations/change_type`, { id: indication.id, type: new_type })
    .do((d) => {
      this.indication_actions.next(indication);
    });    
  }

  savePartnership(partnership) {
    return this.http.post(this.dataUrl + `/person_partnerships`, { partnership }).do((d) => {
      this.partnership_actions.next(partnership);
    });    
  }

  saveExternalUnit(external_unit) {
    return this.http.post(this.dataUrl + `/person_external_units`, { external_unit }).do((d) => {
      this.external_unit_actions.next(external_unit);
    });    
  }

  savePersonContact(person_id, contact_type, contact, details, principal) {
    const contact_data = {
      person_id, 
      contact_type, 
      contact,
      details,
      principal
    };

    return this.http.post(this.dataUrl + `/person_contact`, contact_data).do((d) => {
      this.contact_changes.next(contact_data);
    });    
  }

  savePersonData(person) {          
    return this.http
        .post(this.dataUrl + `/people`, {
          person
        }).do((data) => {          
          this.person_changes.next(data);
        });
  }

  registerPerson(person) {          
    return this.http
        .post(this.dataUrl + `/person`, {
          person
        }).do((data) => {          
          this.person_actions.next({ 
            type: PersonActions.ADD,
            data
          });
        });
  }

  removePersonContact(person_id, contact_id) {
    return this.http.post(this.dataUrl + `/person_contact/remove`, {
      contact_id
    }).do((data) => {
      this.contact_changes.next({ person_id } as IContact);
    });    
  }

  getData(id) {    
    return this.http
        .get(this.dataUrl + `/people/${id}`);
  }

  getPersonRoles(id) {    
    return this.http
        .get(this.dataUrl + `/person_role/person/${id}`);
  }

  getAddresses(id) {    
    return this.http
        .get(this.dataUrl + `/person_address/${id}`);
  }  

  getPersonScheduling(id) {    
    return this.http
        .get(this.dataUrl + `/person_schedule/person/${id}`);
  }

  addRole(person_id, role_id) {
    return this.http
        .post(this.dataUrl + `/person_role`, {
          person_id, role_id
        });
  }

  removeRole(person_id, role_id) {
    return this.http
        .post(this.dataUrl + `/person_role/delete`, {
          person_id, role_id
        });
  }
  
  saveKFName(person_id, kf_name, ideograms) {
    return this.http
        .post(this.dataUrl + `/people_alias/kf_name`, {
          person_id, 
          kf_name,
          ideograms
        });
  }

  search(name) {    
    return this.http
        .get(this.dataUrl + `/people/search/${name}`);
  }

  remove_schedule(schedule) {
    return this.http
        .post(this.dataUrl + `/person_schedule/delete`, {
          id: schedule.id
        });
  }

  save_schedule(schedule) {
    return this.http
        .post(this.dataUrl + `/person_schedule`, {
          schedule
        });
  }

  getCommentsAboutPerson(person_id) {
    return this.http.get(this.dataUrl + `/people_comments/about/${person_id}`); 
  }

  archiveComment(comment, person) {
    return this.http
        .post(this.dataUrl + `/people_comments/archive`, {
          id: comment.id
        }).do((data) => {          
          this.comment_changes.next({ person });
        });
  }

  saveAddress(address) {
    return this.http.post(this.dataUrl + `/person_address`, { address }).do((data) => {          
      this.person_actions.next({ 
        type: PersonActions.ADD_ADDRESS,
        data
      });
    });
  }

  archiveAddress(person_address) {
    return this.http.post(this.dataUrl + `/person_address/archive`, { person_address }).do((data) => {          
      this.person_actions.next({ 
        type: PersonActions.ARCHIVE_ADDRESS,
        data
      });
    });
  }

  saveCommentAboutPerson(person, comment) {    
    return this.http
        .post(this.dataUrl + `/people_comments/about`, {
          person_id: person.id,
          comment
        }).do((data) => {          
          this.comment_changes.next({ person });
        });
  }
}

