import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { Result } from 'app/shared/models/result';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-content-layout-page',
    template: 'redirecting...'
})
export class LoadLoginComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getLoginData().subscribe((result_user : Result) => {
      if(result_user.success) {
        this.router.navigateByUrl(result_user.data.default_page_url || '/diary');
      } else {
        window.location.href=environment.login_url;
      }
    });
  }

}
