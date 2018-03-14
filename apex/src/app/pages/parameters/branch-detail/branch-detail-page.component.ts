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
  acquirers: any[];

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

  private load_data() {
    this.parameterService.getBranch(this.id).subscribe((data) => {
      this.current = data[0];
    });
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
  
  public toggle_associate_acquirer(acquirer, close_action) {
    this.parameterService.ToggleAssociateBranchAcquirer(this.id, acquirer).subscribe((data) => {      
      this.load_data();

      if(close_action) {
        close_action();
      }
    })
  }
}
