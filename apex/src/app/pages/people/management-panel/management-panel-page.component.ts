import { ParameterService } from 'app/services/parameter-service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'app/services/security-service';
import { Result } from '../../../shared/models/result';

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
  program = 0;
  domain = 0;
  branches: any;
  domains = [];


  private person_list_sub: Subscription;
  private router_sub : any;

  constructor(
    private personService: PersonService,
    private securityService: SecurityService,
    private route: ActivatedRoute,
    private router: Router,
    private parameterService: ParameterService) {

  }

  ngOnInit() {
    this.router_sub = this.route.params.subscribe(params => {
      this.current_branch = params['branch'] || 0;
      this.program = params['program'] || 0;
      this.domain = params['domain'] || 0;
      this.filters = params['filter'] || 1;

      this.parameterService.getActiveBranches().subscribe((result_branches) => {
        this.branches = result_branches.data.filter(b => b.category_id == 1);
      });

      if(this.program > 0) {
        this.parameterService.getDomains().subscribe((result_domains) => {
          this.domains = result_domains.data.filter(b => b.program_id == this.program);
        });
      }

      this.securityService.getCurrentUserData()
      .subscribe((result_user : Result<any>) => {
        this.current_branch = params['branch'] || result_user.data.default_branch_id || 0;
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
      case "7":
        people = people.filter((p : any) => {
          return p.is_disciple;
        });
      break;
    }

    if(this.current_branch > 0) {
      people = people.filter((p : any) => {
        return p.branch_id == this.current_branch;
      });
    }

    if(this.program > 0) {
      people = people.filter((p : any) => {
        return p.program_id == this.program;
      });
    }

    if(this.domain > 0) {
      people = people.filter((p : any) => {
        return p.domain_id == this.domain;
      });
    }

    this.people = people;
  }

  filter_people() {
    this.router.navigateByUrl(`people/members/management/${this.current_branch}/${this.filters}/${this.program}/${this.domain}`);
  }

  load_members_list() {
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getPeopleList().subscribe(
      (data : Result<any[]>) => {
        const result = data;
        this.all_people = result.data;

        this.apply_filters();
      }
    );
  }
}
