import { SecurityService } from 'app/services/security-service';
import { Injectable } from '@angular/core';
import { Result } from '../models/result';

@Injectable()
export class AuthService {
  user: any;

  constructor(private securityService: SecurityService) {}

  logout() {
    this.user = null;
    this.securityService.logout();
  }

  getLoginData() {
    return this.securityService
    .getCurrentUserData()
    .do((result : Result) => {
      this.user = result.data;
    });
  }

  isAuthenticated() {
    return this.user != null;
  }
}
