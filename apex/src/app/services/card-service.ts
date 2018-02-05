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
}

