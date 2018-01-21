import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';

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
  only_people_with_issues = "true";
  current_branch = 0; 
  branches: any;


  private person_list_sub: Subscription;  

  constructor(private personService: PersonService, 
    private route: ActivatedRoute,
    private router: Router, 
    private modalService: NgbModal,
    private datePickerConfig: NgbDatepickerConfig) {      
  
  }  

  ngOnInit() {
    this.load_members_list(); 
  }
  
  ngOnDestroy() {
    this.person_list_sub.unsubscribe();
  }

  change_view(view) {
    if(view == 0) {
      this.router.navigateByUrl(`people`);
    } else if (view == 1) {
      this.router.navigateByUrl(`people/members`);
    }
  }

  filter_people() {      
    this.people = this.all_people.filter( (p :any) => {
      return this.only_people_with_issues === "false" || p.issues_level > 0;
    }).filter( (p :any) => {
      return  this.current_branch == 0 || p.branch_id == this.current_branch;
    });
  }

  load_members_list() {    
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getPeopleList().subscribe(
      data => {           
        const result = data.json();   
        this.all_people = result;

        this.filter_people();
      }
    );  
  }
}
