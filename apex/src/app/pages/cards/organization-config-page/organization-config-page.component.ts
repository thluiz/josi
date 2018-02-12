import { ParameterService } from 'app/services/parameter-service';
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
  card_positions;
  
  constructor(private cardService: CardService, 
              private parameterService: ParameterService,
              private route: ActivatedRoute,
              private router: Router,
              private dragulaService: DragulaService) {       
                
    dragulaService.drop.subscribe((value) => {
      console.log(value);
      this.onDrop(value.slice(1));
    });                
  }  
  
  private onDrop(args: any): void {
    let [e] = args;    
    console.log(e);
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

      this.parameterService.getPersonCardPositions().subscribe((data : any) => {
        this.card_positions = data.filter(p => !p.hierarquical);
      });
    });           
  }
  
  ngOnDestroy() {
    
  }

  add_person() {

  }

  save_organization_chart() {    
    this.cardService.saveOrganizationChart(this.id, this.organization.people).subscribe((data) => {
      console.log(data);
      console.log("ok!");
    });    
  }

  remove_person(person_card) {
    
  }
}
