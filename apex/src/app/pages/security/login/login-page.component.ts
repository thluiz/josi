import { AuthService } from 'app/shared/auth/auth.service';
import { environment } from './../../../../environments/environment';
import { ToastrService } from "ngx-toastr";
import { Component, ViewChild, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SecurityService } from 'app/services/security-service';
import { Result } from 'app/shared/models/result';

@Component({
  selector: "app-content-layout-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent {
  @ViewChild("f")
  loginForm: NgForm;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    @Inject(DOCUMENT) private document: any,
    private auth: AuthService,
  ) {}


  onSubmit() {
    this.securityService
    .loginUserByEmailPassword(this.loginForm.value.email,
        this.loginForm.value.password,
        this.loginForm.value.rememberme
      )
    .subscribe(((result : Result<any>) => {
      if(!result.success) {
        this.toastrService.error(result.message);
      } else {
        this.router.navigateByUrl("/security/load_login");
      }
    }));
  }

  onForgotPassword() {
    this.router.navigate(["forgotpassword"], { relativeTo: this.route.parent });
  }

  onLoginFromGoogle() {
    this.document.location.href=environment.google_login_url;
  }
}
