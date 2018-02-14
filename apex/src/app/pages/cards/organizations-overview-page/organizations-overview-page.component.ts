import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'app/services/card-service';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './organizations-overview-page.component.html',
  styleUrls: ['../cards-customizations.scss']  
})
export class OrganizationsOverviewPageComponent implements OnInit, OnDestroy {
  
  organizations = [];  
  
  constructor(private cardService: CardService) {          
  }  
  
  ngOnInit() {    
    this.cardService.getOrganizations(true).subscribe((data : any) => {
      this.organizations = data;
    });
  }
  
  ngOnDestroy() {
    
  }  
}
