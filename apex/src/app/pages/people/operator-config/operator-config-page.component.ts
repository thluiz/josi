import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'app/services/card-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './operator-config-page.component.html',
  styleUrls: ['../people-customizations.scss']  
})
export class OperatorConfigPageComponent implements OnInit, OnDestroy {
  
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
    });    
  }
  
  ngOnDestroy() {
    
  }
}
