import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PersonService } from 'app/services/person-service';
import { ParameterService } from 'app/services/parameter-service';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import { Subscription } from 'rxjs';
import { SecurityService } from 'app/services/security-service';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './people-away-page.component.html',
  styleUrls: ['../people-customizations.scss'],
  providers: [DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class PeopleAwayPageComponent implements OnInit, OnDestroy {
  people: any;    
  all_people: any;
  current_view = 0;
  filters = "1";
  current_branch = 0; 
  branches: any;
  search_name = "";

  private person_list_sub: Subscription;  

  constructor(
    private personService: PersonService, 
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private modalService: NgbModal,
    private parameterService: ParameterService,
    private datePickerConfig: NgbDatepickerConfig) {      
  
  }  

  ngOnInit() {        
    this.current_branch = this.activatedRoute.snapshot.queryParams["branch"] || 0;
    this.search_name = this.activatedRoute.snapshot.queryParams["name"] || "";
    
    this.parameterService.getActiveBranches().subscribe((branches) => {
      this.branches = branches;
    });

    this.securityService.getCurrentUserData().subscribe((user) => {      
      this.current_branch = this.activatedRoute.snapshot.queryParams["branch"] || user.default_branch_id || 0;
      this.load_people_away_list();
    });     
  }
  
  ngOnDestroy() {
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();    
    }
  }

  apply_filters() {  
    let people = this.all_people;
    

    if(this.current_branch > 0) {
      people = people.filter((p : any) => {
        return p.branch_id == this.current_branch;
      });
    }

    this.people = people;
  }

  filter_people() {
    this.router.navigateByUrl(`people/away?branch=${this.current_branch}&name=${this.search_name}`);
    this.load_people_away_list();
  }

  keyDownFunction(event) {    
    if(event.keyCode == 13) {
      this.filter_people();
    }
  }

  load_people_away_list() {    
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getPeopleAwayList(this.current_branch, this.search_name).subscribe(
      data => {                   
        this.all_people = data;

        this.apply_filters();
      }
    );  
  }
}
