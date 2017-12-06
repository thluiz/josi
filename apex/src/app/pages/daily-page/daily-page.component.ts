import { Component, TemplateRef, ViewChild } from '@angular/core';
import {Observable} from "RxJS/Rx";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { PersonService } from 'app/services/person-service';


@Component({
  selector: 'app-full-layout-page',
  templateUrl: './daily-page.component.html',
  styleUrls: ['./daily-page.component.scss'],
  providers: [PersonService]
})
export class DailyPageComponent {
  public daily: Observable<any[]>;
  public cols;
  public current_week_day;  
  public current_branch;
  public branches;
  public domains;

  private alive;

  constructor(private personService: PersonService) {
    this.current_week_day = (new Date).getDay() - 1;        
  }
  
  ngOnInit() {
    this.getMonitorData();    
    this.alive = true;
    /* IntervalObservable.create(10000)
    .takeWhile(() => this.alive) // only fires when component is alive
    .subscribe(() => {
      this.getMonitorData()
    }); */         
  }

  ngOnDestroy() {    
    this.alive = false;
    console.log('destroy timer!');
  }

  public branchSelected(e) {
    console.log(e);
  }

  getMonitorData(current_branche?) {    
    this.personService.getDailyMonitor().subscribe(
      data => {          
        const result = data.json();
        this.branches = result.branches;
        this.domains = result.domains;
        this.domains.daily = [];
        this.cols = [
          { width: 160 }, { width: 30}, { width: 30}
        ]

        for(var i = 0; i< result.columns.length; i++) {
          let c = result.columns[i];
          this.cols[this.cols.length] = {
            prop: 'incidents' + c.date,
            name: c.name,
            current: c.current,
            width: 150
          };
        }

        for(var w = 0; w < result.domains.length; w++) {
          let domain = result.domains[w];
          this.domains[w].daily = [];
          let people = result.people.filter(p => p.domain_id == domain.id);
          this.domains[w].number_of_members = people.length;

          for(var i = 0; i< result.columns.length; i++) {    
            let c = result.columns[i];
            
            for(var z = 0; z< people.length; z++) {
              let person_incidents = people[z];  
              if(!person_incidents.dates) {
                person_incidents.dates = [];
              }

              person_incidents.dates[i] = person_incidents.dates[i] || [];
              let incidents = result.incidents.filter((i : any) => { 
                return i.date == c.date && i.person_id == people[z].person_id;
              });

              if(incidents.length > 0) {
                person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);              
              }

              this.domains[w].daily[z] = person_incidents;
            }
          }       
        }   

        this.current_branch = current_branche;
        if(!this.current_branch) {
          this.current_branch = this.branches[0];
        }        
      },
      err => console.error(err)      
    );

    setTimeout(() => this.getMonitorData(current_branche), 3000);
  }
  
}
