import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

enum Panels {
  Members = 0,
  Managers = 1     
}

@Component({
  selector: 'diary-header',
  templateUrl: './diary-header.component.html'
})
export class DiaryHeaderComponent implements OnInit {  
  
  @Input("panel") initial_panel: string;
  current_panel;
  panels = Panels;   

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {    
    if(this.initial_panel == "members") {        
      this.current_panel = Panels.Members;
    } else if(this.initial_panel == "managers") {        
      this.current_panel = Panels.Managers;
    } 
  }

  change_display(panel : Panels) {    
    switch(panel.toString()) {
      case Panels.Members.toString(): 
        this.router.navigateByUrl(`diary/members`);
        break;
      case Panels.Managers.toString():         
        this.router.navigateByUrl(`organizations`);
        break;
    }
  }
}