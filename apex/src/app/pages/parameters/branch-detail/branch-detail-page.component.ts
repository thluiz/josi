
import {zip as observableZip,  Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { isArray } from 'util';

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

  current_product_association : any;
  categories: any[];
  all_products: any[];
  currencies: any[];
  products_from_category: any[];
  current_product: any;

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

  save_branch_product(close_action) {
    this.saving = true;
    this.parameterService.saveBranchProduct(this.current.id, this.current_product)           
    .subscribe((data) => {      
      if(close_action) {
        close_action();
      }
      this.saving = false;      
      this.load_data();      
    });
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

  open_edit_product(product, content) {
    this.saving = false;    
    this.current_product = product;
    this.current_product.name = product.product;    

    observableZip(
      this.parameterService.getProductCategories(),      
      this.parameterService.getCurrencies(),
      (categories, currencies) => {
        this.categories = categories;                
        this.currencies = currencies;

        this.open_modal(content);
      }
    ).subscribe(); 
  }

  open_add_product(content) {
    this.saving = false;    
    this.current_product = {};

    observableZip(
      this.parameterService.getProductCategories(),      
      this.parameterService.getCurrencies(),
      (categories, currencies) => {
        this.categories = categories;                
        this.currencies = currencies;

        this.open_modal(content);
      }
    ).subscribe();    
  }
  
  open_associate_product(content) {
    this.current_product_association = { valid: false};
    this.saving = false;

    observableZip(
      this.parameterService.getProductCategories(),
      this.parameterService.getProducts(),
      (categories, products) => {
        this.categories = categories;        
        this.all_products = products;

        this.open_modal(content);
      }
    ).subscribe();    
  }

  get_products_from_category() {
    if(this.current_product_association.product_id > 0) {
      this.current_product_association.product_id = 0;
      this.current_product_association.valid = false;
    }

    let products = this.all_products.filter(p => p.category_id == this.current_product_association.category_id);    

    if(this.current.associated_products != null && this.current.associated_products.length > 0) {
      //TODO: Filter already defined products
      // products = products.filter(f => this.current.associated_products.find(p2 => p2.id != f.id) == null);
    }
        
    this.products_from_category = products
  }

  change_base_product_for_association() {
    let current_product = this.all_products.find(p => p.id == this.current_product_association.product_id);
    this.current_product_association.base_value = current_product.base_value;
    this.current_product_association.valid = true;
  }

  associate_branch_product(close_action) {
    this.parameterService.associateBranchProduct({
        branch_id: this.id, 
        product_id: this.current_product_association.product_id, 
        base_value: this.current_product_association.base_value
    }).subscribe((data) => {
      this.load_data();
      if(close_action) {
        close_action();
      }
    });
  }

  archive_branch_product(product) {
    this.parameterService.archiveBranchProduct({
      product
    }).subscribe((data) => {
      this.load_data();      
    });
  }

  private open_modal(content: any) {
    this.ngbModalService.open(content).result.then((result) => {
    }, (reason) => {      
      console.log(reason);
    });
  } 
  
  private load_data(callback = () => { }) {
    observableZip(
      this.parameterService.getBranch(this.id),
      this.parameterService.getBranchMap(this.id),  
      this.parameterService.getIncidentTypes(),
      this.parameterService.getBranchProducts(this.id),
      (branch_data, map, incident_types, branch_products : any[]) => {
        const current = branch_data[0];
        current.map = map;
        current.associated_products = branch_products.filter(bp => bp.product_id != null);
        current.branch_products = branch_products.filter(bp => bp.product_id == null);

        if(!current.associated_products) {
          current.associated_products = [];
        }

        if(!current.branch_products) {
          current.branch_products = [];
        }

        if(!current.map) {
          current.map = [];
        }          

        if(!current.acquirers || !isArray(current.acquirers)) {
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
