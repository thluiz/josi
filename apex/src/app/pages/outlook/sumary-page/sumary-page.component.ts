import { Component, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import { IncidentService } from 'app/services/incident-service';

import { FormControl, FormsModule, ReactiveFormsModule,
    FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbDateStruct, 
  NgbDatepickerI18n, 
  NgbDatepickerModule,
  NgbCalendar, 
  NgbTimeStruct,    
} from '@ng-bootstrap/ng-bootstrap';

import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './sumary-page.component.html',
  styleUrls: ['./sumary-page.component.scss'],
  providers: [IncidentService]
})
export class SumaryPageComponent implements OnInit, OnDestroy {
  sumary: Observable<any[]>;
  members_sumary_cols = [];
  members_sumary : Observable<any[]>;
  branches;
  current_branch_name;
  current_branch;
  current_week_text;
  current_month_text;
  current_date_text;
  show_change_branch;
  current_date : { year : number, month: number, day: number };
  private update_timer;      
  private current_week = 0;
  private current_month = 0;  

  constructor(private incidentService: IncidentService) {
    this.branches = [];
    this.current_branch_name = "";
    const actual_date = new Date();    
    this.current_date = {
      year: actual_date.getFullYear(),
      month: actual_date.getMonth() + 1,
      day: actual_date.getDate()
    };

    this.members_sumary_cols = [                    
      { width: "88%", name: "Membros" },
      { width: "3%", icon: "fa fa-user", description: "Membros" },
      { width: "3", icon: "ft-calendar", description: "Agendamento" },
      { width: "3%", icon: "icon-wallet", description: "Financeiro" },
      { width: "3%", icon: "far fa-envelope", description: "Comunicados" }
    ];        
  }
  
  ngOnInit() {
    this.getSumaryData();          
  }

  ngOnDestroy() {
    if(this.update_timer) {        
      clearTimeout(this.update_timer);
    }
  }

  branchSelected(id) {
    if(this.update_timer) {
      clearTimeout(this.update_timer);    
      this.update_timer = null;
    }

    this.update_timer = null;        
    this.current_branch = id;
    this.getSumaryData();
  }

  change_week(modifier) {
    if(this.update_timer) {
      clearTimeout(this.update_timer);    
      this.update_timer = null;
    }

    this.update_timer = null;
    this.current_week += modifier;
    this.getSumaryData();
  }

  change_date(new_date) {    
    if(this.update_timer) {
      clearTimeout(this.update_timer);    
      this.update_timer = null;
    }

    this.update_timer = null;
    this.current_date = new_date;
    this.getSumaryData();
  }

  change_month(modifier) {
    if(this.update_timer) {
      clearTimeout(this.update_timer);    
      this.update_timer = null;
    }

    this.current_month += modifier;
    this.getSumaryData();
  }
   
  getSumaryData() {

    if(!this.incidentService) {
      return;
    }

    this.incidentService.getSumary(this.current_branch, this.current_month, this.current_week, 
                `${this.current_date.year}-${this.current_date.month}-${this.current_date.day}`)
      .subscribe(
      data => {                  
        const result = data.json();
        let sumary = result.sumary;
        this.current_week_text = result.current_week_text;
        this.current_month_text = result.current_month_text;
        this.current_date_text = result.current_date_text;
        this.members_sumary = result.members_sumary;
        this.branches = [{ id: 0, name: 'Todos os Núcleos' }].concat(result.branches);
        
        this.current_branch_name = (this.current_branch > 0 ? 
                        this.branches.filter(b => b.id == this.current_branch)[0]
                        : this.branches[0]
                      ).name;
        
        for(let k = 0 ; k < sumary.length; k++ ) {                      
          sumary[k].cols = [];                    

          for(let i = 0; i < sumary[k].activity.length; i++){            
            for(let z in sumary[k].activity[i]) {
              sumary[k].cols[sumary[k].cols.length] = sumary[k].activity[i][z];
            }
          }
        }

        this.sumary = sumary;
      },
      err => console.error(err)      
    );
    
    if(this.update_timer) {
      clearTimeout(this.update_timer);
    }

    const update_interval = 600000;
    this.update_timer = setTimeout(() => { this.getSumaryData() }, update_interval);
  }
   
}
