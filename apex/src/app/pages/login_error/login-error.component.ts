import { environment } from '../../../environments/environment';
import { Component } from '@angular/core';

@Component({
  selector: 'app-content-layout-page',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent {
  private dataUrl = environment.site_url;

  constructor() {

  }

  try_relogin() {
    window.location.href=environment.login_url;
  }
}
