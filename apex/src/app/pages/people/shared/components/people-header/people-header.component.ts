import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

enum Panels {
  Members = 0,
  Interested = 1,
  Away = 2,
  ServiceProvider = 3,
  Voucher = 4   
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
    } else if(this.initial_panel == "service_providers") {        
      this.current_panel = Panels.ServiceProvider;
    } else if(this.initial_panel == "voucher") {        
      this.current_panel = Panels.Voucher;
    }
    
  }

  change_display(panel : Panels) {
    switch(panel.toString()) {
      case Panels.Members.toString(): 
        this.router.navigateByUrl(`people/members`);
        break;
      case Panels.Away.toString(): 
        this.router.navigateByUrl(`people/away`);
        break;
      case Panels.Interested.toString(): 
        this.router.navigateByUrl(`people/interested`);
        break;
      case Panels.ServiceProvider.toString(): 
        this.router.navigateByUrl(`people/service_provider`);
        break;
      case Panels.Voucher.toString(): 
        this.router.navigateByUrl(`people/voucher`);
        break;
    }
  }
}