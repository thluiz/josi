import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService } from 'app/services/card-service';
import { ActivatedRoute, Router } from '@angular/router';
import { DragulaService, DragulaModule } from 'ng2-dragula';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './organization-config-page.component.html',
  styleUrls: ['../cards-customizations.scss']  
})
export class OrganizationConfigPageComponent implements OnInit, OnDestroy {
  
  private id;
  private sub;
  organization;
  
  constructor(private cardService: CardService, 
              private route: ActivatedRoute,
              private router: Router,
              private dragulaService: DragulaService) {       
                
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });                
  }  
  
  private onDrop(args: any): void {
    let [e] = args;    
  }

  public dragulaOptions: any = {
    removeOnSpill: false
  }

  ngOnInit() {    
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];      
      
      this.cardService.getOrganization(this.id).subscribe((data : any) => {
        this.organization = data;
      });
    });   
    
    
  }
  
  ngOnDestroy() {
    
  }

  add_person() {

  }

  save_person_position(person_card) {

  }

  remove_person(person_card) {
    
  }
}
