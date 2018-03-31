import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './branch-detail-page.component.html',
  styleUrls: ['../parameters-customizations.scss']  
})
export class BranchDetailPageComponent implements OnInit, OnDestroy {     

  private id;
  private sub;

  current: any;
  
  current_acquirer: any;
  current_map: any;
  acquirers: any[];
  incident_types: any[];

  saving = false; 

  constructor(private parameterService: ParameterService, 
              private ngbModalService: NgbModal,
              private route: ActivatedRoute,
              private router: Router) {      

  }  

  ngOnInit() {    
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];      
      
      this.load_data();
    }); 
  }

  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  toggle_associate_acquirer(acquirer, close_action) {
    this.parameterService.ToggleAssociateBranchAcquirer(this.id, acquirer).subscribe((data) => {      
      this.load_data();

      if(close_action) {
        close_action();
      }
    })
  }

  build_map(map = { start_time: {}, end_time: {}, 
                  incident_type_id: 10, 
                  receive_voucher: false, 
                  week_days: [],
                  start_hour: 9,
                  start_minute: 0,
                  end_hour: 10,
                  end_minute: 0,
                  branch_id: 0
                }) {

    map.branch_id = this.current.id;

    for(var i = 1; i <= 7; i++) {
      let map_week = map.week_days.find(wk => wk.week_day == i);
      if(!map_week) {
        map.week_days[map.week_days.length] = {
          week_day: i,
          selected: false,
          abrev: this.getWeekDayAbrev(i)
        }
      } else {
        map_week.abrev = this.getWeekDayAbrev(i);
        if(map_week.selected === undefined) {
          map_week.selected = true;
        }
      }
    }

    map.start_time = {
      hour: map.start_hour,
      minute: map.start_minute
    }

    map.end_time = {
      hour: map.end_hour,
      minute: map.end_minute
    }

    map.week_days = map.week_days.sort((w1, w2) => {
      if(w1.week_day > w2.week_day) return 1;
      if(w1.week_day == w2.week_day) return 0;
      if(w1.week_day < w2.week_day) return -1;
    });

    return map;
  }

  save_map(map, close_action) {
    console.log(map);
    this.parameterService.saveBranchMap(map).subscribe((data) => {
      if(close_action) {
        this.load_data(() => close_action('save map'));      
      }
    });    
  }

  archive_map(map) {
    this.parameterService.archiveMap(map).subscribe((data) => {      
        this.load_data();            
    });
  }

  private getWeekDayAbrev(week_day :number) {
    switch (week_day) {
      case 1:
        return "Dom";            
      case 2:
        return "Seg";
      case 3:
        return "Ter";
      case 4:
        return "Qua";
      case 5:
        return "Qui";                
      case 6:
        return "Sex";
      case 7:
        return "Sáb";      
    }
    return "ND"  
  }

  open_add_map(content) {
    this.current_map = this.build_map();
    this.open_modal(content);
  }

  open_edit_map(content, map) {
    this.current_map = this.build_map(map);
    this.open_modal(content);
  }

  open_add_acquirer(content) {
    this.current_acquirer = null;
    this.parameterService.getAcquirers().subscribe((data) => {
      let list = data as any[];
      if(this.current.accquirers) {
        let current_list = this.current.accquirers as any[];
        list = list.filter((l) => current_list.find(c => c.id ==  l.id) != null);
      }
      this.acquirers = list;
      this.open_modal(content);
    });
  }

  private open_modal(content: any) {
    this.ngbModalService.open(content).result.then((result) => {
    }, (reason) => {      
      console.log(reason);
    });
  } 
  
  private load_data(callback = () => { }) {
    Observable.zip(
      this.parameterService.getBranch(this.id),
      this.parameterService.getBranchMap(this.id),  
      this.parameterService.getIncidentTypes(),
      (branch_data, map, incident_types) => {
        const current = branch_data[0];
        current.map = map;

        if(!current.map) {
          current.map = [];
        }          

        if(!current.acquirers) {
          current.acquirers = [];
        }

        let types = incident_types.filter(i => i.use_in_map) as any[];
        incident_types.forEach(tp => {
          if(tp.childrens) {   
            tp.childrens.filter(i => i.use_in_map).forEach((i) => {
              types.push(i);
            });                                    
          }
        });         
        this.incident_types = types; 
        this.current = current;

        if(callback) {
          callback();
        }
      }    
    ).subscribe();
  }  
}
