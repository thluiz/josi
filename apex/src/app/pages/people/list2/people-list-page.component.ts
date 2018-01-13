import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './people-list-page.component.html',
  styleUrls: ['./people-list-page.component.scss'],
  providers: [PersonService, DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class PeopleList2PageComponent implements OnInit, OnDestroy {
  people: any;    
  all_people: any;
  issues_level = 2;
  current_branch = 0;
  show_change_branch = false;
  show_change_issues_level = false;

  current_branch_name = "Todos os Núcleos"
  current_issues_level = "Painel - Praticantes com pendências"  
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

  filter_people(branch, level) {
    this.people = this.all_people.filter( (p :any) => {
      return  this.issues_level == 0 || p.issues_level >= this.issues_level;
    }).filter( (p :any) => {
      return  this.current_branch == 0 || p.branch_id == this.current_branch;
    });

    this.current_issues_level = this.issues_level == 2 ? 
                              "Painel - Praticantes com pendências" :
                              this.issues_level == 1 ?
                              "Painel - Praticantes com tratamentos " 
                              : "Painel - Praticantes";
  }

  load_members_list() {    
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getPeopleList().subscribe(
      data => {           
        const result = data.json();   
        this.all_people = result;

        this.filter_people(this.current_branch, this.issues_level);
      }
    );  
  }
}
