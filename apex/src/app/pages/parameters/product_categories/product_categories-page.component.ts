import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from "@angular/core";
import { ParameterService } from "app/services/parameter-service";
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './product_categories-page.component.html',
  styleUrls: ['../parameters-customizations.scss']
})
export class ProductCatergoriesPageComponent implements OnInit {
  collection: any[];
  current_item: any;
  saving = false;

  constructor(private parameterService: ParameterService,
              private ngbModalService: NgbModal) {

  }

  ngOnInit() {
    this.load_data();
  }

  private load_data() {
    this.parameterService.getProductCategories().subscribe((result: Result<any[]>) => {
      this.collection = result.data;
    });
  }

  save(close_action) {
    this.saving = true;
    this.parameterService.saveProductCategory(this.current_item).subscribe(() => {
      if(close_action) {
        close_action();
      }
      this.saving = false;
      this.load_data();
    });
  }

  create(content) {
    const col = this.collection;
    const suggested_order = col.length > 0 ? col[col.length - 1].order + 1 : 0;

    this.current_item = {
      id: 0,
      name: "",
      order: suggested_order
    }

    this.open_modal(content);
  }

  edit(content, item) {
    this.current_item = item;
    this.open_modal(content);
  }

  private open_modal(content: any) {
    this.ngbModalService.open(content).result.then(() => {
    }, (reason) => {
      this.current_item = null;
      console.log(reason);
    });
  }
}
