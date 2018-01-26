import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

enum Panels {
  Members = 0,
  Interested = 1,
  Away = 2   
}

@Component({
  selector: 'people-header',
  templateUrl: './people-header.component.html'
})
export class PeopleHeaderComponent implements OnInit {  
  
  @Input("panel") initial_panel: string;
  current_panel;   

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {    
    if(this.initial_panel == "members") {        
      this.current_panel = Panels.Members;
    } else if(this.initial_panel == "away") {        
      this.current_panel = Panels.Away;
    } else if(this.initial_panel == "interested") {        
      this.current_panel = Panels.Interested;
    }
  }

  change_display(panel : Panels) {
    switch(panel) {
      case Panels.Members: 
        this.router.navigateByUrl(`people/members`);
        break;
      case Panels.Away: 
        this.router.navigateByUrl(`people/away`);
        break;
      case Panels.Interested: 
        this.router.navigateByUrl(`people/interested`);
        break;
    }
  }
}