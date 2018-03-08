import { UtilsService } from './utils-service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, ReplaySubject} from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class FinancialService {
  private dataUrl = environment.api_url;    

  constructor(private http: HttpClient, private utilsService: UtilsService) { }  

  getBranchAccounts(branch_id :number) {    
    return this.http.get(this.dataUrl + `/financial/accounts/${branch_id}`);
  }

  getExpectedPayments(account_id:number, start_date? :Date, end_date? :Date) {
    let url = this.dataUrl + `/financial_board/expected_payments/${account_id}?`;

    url = this.concatenate_dates(url, start_date, end_date);

    return this.http.get(url);
  }

  getMissingPayments(account_id:number, start_date? :Date, end_date? :Date) {
    let url = this.dataUrl + `/financial_board/missing_payments/${account_id}?`;

    url = this.concatenate_dates(url, start_date, end_date);

    return this.http.get(url);
  }

  getAccountStatus(account_id:number, start_date? :Date, end_date? :Date) {
    let url = this.dataUrl + `/financial_board/account_status/${account_id}?`;

    url = this.concatenate_dates(url, start_date, end_date);

    return this.http.get(url);
  }

  private concatenate_dates(url: string, start_date: Date, end_date: Date) {
    if (start_date) {
      url += `start=${start_date.getFullYear()}-${start_date.getMonth() + 1}-${start_date.getDate()}`;
    }
    if (start_date && end_date) {
      url += "&";
    }
    if (end_date) {
      url += `end=${end_date.getFullYear()}-${end_date.getMonth() + 1}-${end_date.getDate()}`;
    }
    return url;
  }
}

