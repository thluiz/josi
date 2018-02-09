import { ModalService, ModalType } from 'app/services/modal-service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './interested-panel-page.component.html',
  styleUrls: ['../people-customizations.scss']  
})
export class InterestedPanelPageComponent implements OnInit, OnDestroy {
  people: any;    
  all_people: any;
  current_view = 0;
  filters = "1";
  current_branch = 0; 
  branches: any;
  search_name = "";

  private person_list_sub: Subscription;  

  constructor(private personService: PersonService, 
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private modalService: ModalService) {      
  
  }  

  ngOnInit() {        
    this.current_branch = this.activatedRoute.snapshot.queryParams["branch"] || 0;
    this.search_name = this.activatedRoute.snapshot.queryParams["name"] || "";

    this.load_interested_list();
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
    this.router.navigateByUrl(`people/interested?branch=${this.current_branch}&name=${this.search_name}`);
    this.load_interested_list();
  }

  keyDownFunction(event) {    
    if(event.keyCode == 13) {
      this.filter_people();
    }
  }

  open_new_person_modal() {
    this.modalService.open(ModalType.AddPerson, null);
  }

  load_interested_list() {    
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getInterestedList(this.current_branch, this.search_name).subscribe(
      data => {                   
        this.all_people = data;

        this.apply_filters();
      }
    );  
  }
}
