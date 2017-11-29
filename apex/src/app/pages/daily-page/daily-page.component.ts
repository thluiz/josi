import { Component, TemplateRef, ViewChild } from '@angular/core';
import { PersonService } from 'app/services/person-service';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './daily-page.component.html',
  styleUrls: ['./daily-page.component.scss'],
  providers: [PersonService]
})
export class DailyPageComponent {
  public daily;
  public cols;
  
  @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;

  constructor(private personService: PersonService) {
    this.cols = [
      { prop: 'name', width: 250, canAutoResize: true, frozenLeft: true, name:'' },
    ]
  }
  
  ngOnInit() {
    this.getMonitorData();
  }

  getMonitorData() {
    this.personService.getDailyMonitor().subscribe(
      data => {          
        const result = data.json();
        let daily = [];

        for(var i = 0; i< result.columns.length; i++) {
          let c = result.columns[i];
          this.cols[this.cols.length] = {
            prop: 'incidents' + c.date,
            name: c.name            
          };

          for(var z = 0; z< result.people.length; z++) {
            let current_people_date = result.people[z];  
            let incidents = result.incidents.filter((i : any) => { 
              return i.date == c.date && i.person_id == result.people[z].person_id;
            });

            if(incidents.length > 0) {
              current_people_date["incidents" + c.date] = incidents.map(i => {
                return `<b>${i.start_hour}</b> - ${i.abrev}`
              }).join("<br />");
            }

            daily[z] = current_people_date;
          }
        }       
        
        this.daily = daily;
        console.log(daily);
        console.log(this.cols);
      },
      err => console.error(err),
      () => console.log('done loading monitor')
    );
  }
  
}
