import { ParameterService } from 'app/services/parameter-service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'app/services/security-service';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './management-panel-page.component.html',
  styleUrls: ['../people-customizations.scss'],
  providers: [DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class ManagementPanelPageComponent implements OnInit, OnDestroy {
  people: any;    
  all_people: any;
  current_view = 0;
  filters = "1";
  current_branch = 0; 
  branches: any;


  private person_list_sub: Subscription;  
  private router_sub : any;

  constructor(
    private personService: PersonService, 
    private securityService: SecurityService, 
    private route: ActivatedRoute,
    private router: Router, 
    private modalService: NgbModal,
    private parameterService: ParameterService,
    private datePickerConfig: NgbDatepickerConfig) {      
  
  }  

  ngOnInit() {    
    this.router_sub = this.route.params.subscribe(params => {      
      this.current_branch = params['branch'] || 0;            
      this.filters = params['filter'] || 1;           
      
      this.parameterService.getActiveBranches().subscribe((branches) => {
        this.branches = branches;
      });

      this.parameterService.getActiveBranches().subscribe((branches) => {
        this.branches = branches;
      });

      this.securityService.getCurrentUserData().subscribe((user) => {      
        this.current_branch = params['branch'] || user.default_branch_id || 0;
        this.load_members_list();
      });       
    });    
  }
  
  ngOnDestroy() {
    this.person_list_sub.unsubscribe();
    this.router_sub.unsubscribe();
  }

  apply_filters() {  
    let people = this.all_people;
    
    switch(this.filters) {      
      case "1":
        people = people.filter((p : any) => {
          return p.comunication_status 
                || p.financial_status != 0
                || p.scheduling_status != 0
                || p.data_status != 0;
        });
      break;
      case "2":
        people = people.filter((p : any) => {
          return p.data_status != 0;
        });
      break;
      case "3":
        people = people.filter((p : any) => {
          return p.financial_status != 0;
        });
      break;
      case "4":
        people = people.filter((p : any) => {
          return p.scheduling_status != 0;
        });
      break;
      case "5":
        people = people.filter((p : any) => {          
          return p.comunication_status;
        });
      break;
      case "6":
        people = people.filter((p : any) => {
          return p.has_birthday_this_month;
        });
      break;
    }

    if(this.current_branch > 0) {
      people = people.filter((p : any) => {
        return p.branch_id == this.current_branch;
      });
    }

    this.people = people;
  }

  filter_people() {
    this.router.navigateByUrl(`people/members/management/${this.current_branch}/${this.filters}`);
  }

  load_members_list() {    
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getPeopleList().subscribe(
      data => {           
        const result = data;   
        this.all_people = result;

        this.apply_filters();
      }
    );  
  }
}
