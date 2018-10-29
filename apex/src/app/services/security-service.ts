import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'environments/environment';
import { Result } from 'app/shared/models/result';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SecurityService {
    private dataUrl = environment.api_url;

    constructor(private http:HttpClient) {

    }

    requestPasswordReset(email) {
      return this.http.post<Result<any>>(this.dataUrl + `/password_request`, {
        email
      });
    }

    resetPassword(code, password, confirm) {
      return this.http.post<Result<any>>(this.dataUrl + `/reset_password`, {
        code, password, confirm
      });
    }

    loginUserByEmailPassword(email, password, extended) {
      return this.http.post<Result<any>>(this.dataUrl + `/auth/login`, {
        email, password, extended
      });
    }

    getCurrentUserData() {
      return this.http.get(this.dataUrl + `/users/current`);
    }

    logout() {
      return this.http.get<Result<any>>(this.dataUrl + `/auth/logout`)
    }
}
