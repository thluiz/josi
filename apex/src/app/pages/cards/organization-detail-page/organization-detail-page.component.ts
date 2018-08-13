import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'app/services/card-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './organization-detail-page.component.html',
  styleUrls: ['../cards-customizations.scss']
})
export class OrganizationDetailPageComponent implements OnInit, OnDestroy {

  private id;
  private sub;
  organization;

  constructor(private cardService: CardService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];

      this.cardService.getOrganization(this.id, true).subscribe((result_data : any) => {
        this.organization = result_data.data;
      });
    });
  }

  ngOnDestroy() {

  }
}
