import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './members-panel-page.component.html',
  styleUrls: ['../people-customizations.scss'],
  providers: [DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class MembersPanelPageComponent implements OnInit, OnDestroy {
  
  programs: any;  
  private person_list_sub: Subscription;  

  private contact_changes_subscriber: Subscription;
  private person_changes_subscriber: Subscription;    

  constructor(private personService: PersonService, 
    private route: ActivatedRoute,
    private router: Router, 
    private modalService: NgbModal,
    private datePickerConfig: NgbDatepickerConfig) {      
  
  }  
  
  ngOnInit() {    
    this.person_changes_subscriber = this.personService.personChanges$
    .subscribe((data) => {
      this.load_members_list();
    });

    this.contact_changes_subscriber = this.personService.contactChanges$    
    .subscribe((data) => {            
      this.load_members_list();
    });

    this.load_members_list(); 
  }
  
  ngOnDestroy() {
    this.person_list_sub.unsubscribe();
    this.person_changes_subscriber.unsubscribe();
  }

  change_view(view) {
    if(view == 0) {
      this.router.navigateByUrl(`people`);
    } else if (view == 1) {
      this.router.navigateByUrl(`people/members`);
    }
  }  

  load_members_list() {     
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getMembersList().subscribe(
      data => {           
        const result = data;    
        console.log(result);
        this.programs = result;
      }
    );
  }
}
