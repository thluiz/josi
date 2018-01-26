import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DailyMonitorDisplayType } from 'app/services/person-service';

enum Display {
  Members = 0,
  Management = 1
}

@Component({
  selector: 'people-change-members-view',
  templateUrl: './change-members-view.component.html'
})
export class ChangeMembersViewComponent implements OnInit {  

  @Input("display") initial_display: string;
  display;   

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {    
    if(this.initial_display == "members") {        
      this.display = Display.Members;
    } else if(this.initial_display == "management") {        
      this.display = Display.Management;
    } 
  }

  change_view(display) {
    console.log(display);
    switch(display) {
      case "0": 
        this.router.navigateByUrl(`people/members`);
        break;
      case "1": 
        this.router.navigateByUrl(`people/members/management`);
        break;
    }
  }
}