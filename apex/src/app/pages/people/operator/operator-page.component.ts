import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CardService } from 'app/services/card-service';
import { SecurityService } from 'app/services/security-service';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './operator-page.component.html',
  styleUrls: ['../people-customizations.scss']
})
export class OperatorPageComponent implements OnInit, OnDestroy {

  private id;
  private sub;
  organization;

  constructor(private cardService: CardService,
              private securityService: SecurityService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if(params['id'] === "current") {
        this.securityService.getCurrentUserData()
        .subscribe((result_user : Result<any>) => {
          this.id = result_user.data.person_id;
        });
      } else {
        this.id = +params['id'];
      }
    });
  }

  ngOnDestroy() {

  }
}
