import { SecurityService } from 'app/services/security-service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './default-route.component.html',
  styleUrls: ['./default-route.component.scss']
})
export class DefaultRouteComponent implements OnInit {
  constructor(private securityService: SecurityService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.securityService.getCurrentUserData().subscribe((result_user : Result<any>) => {
      if(result_user.success) {
        this.router.navigateByUrl(result_user.data.default_page_url || '/diary');
      } else {
        window.location.href=environment.login_url;
      }
    });
  }
}
