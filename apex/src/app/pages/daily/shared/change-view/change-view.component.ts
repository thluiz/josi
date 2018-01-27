import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DailyMonitorDisplayType } from 'app/services/person-service';

@Component({
  selector: 'daily-change-view',
  templateUrl: './change-view.component.html'
})
export class DailyChangeViewComponent implements OnInit {  

  @Input() initial_display: string;
  display;   

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {    
    if(this.initial_display == "day") {        
      this.display = DailyMonitorDisplayType.Day;
    } else if(this.initial_display == "week") {        
      this.display = DailyMonitorDisplayType.Week;
    } else if(this.initial_display == "agenda") {        
      this.display = DailyMonitorDisplayType.Agenda;
    } else if(this.initial_display == "current") {        
      this.display = DailyMonitorDisplayType.Current;
    }
  }

  change_display(display) {
    if(display == DailyMonitorDisplayType.Week) {
      this.router.navigateByUrl(`daily/week`);
    } else if(display == DailyMonitorDisplayType.Day) {
      this.router.navigateByUrl(`daily/day`);
    } else if(display == DailyMonitorDisplayType.Agenda) {
      this.router.navigateByUrl(`daily/agenda`);
    } else if(display == DailyMonitorDisplayType.Current) {
      this.router.navigateByUrl(`daily/current_activities`);
    }
  }
}