
import {zip as observableZip,  Observable } from 'rxjs';

import {delay} from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit } from "@angular/core";
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['../parameters-customizations.scss']
})
export class ProductsPageComponent implements OnInit {
  category_group: { id: number, name: string, items : any[] }[];
  collection: any[];
  currencies: any[];
  current_item: any;
  saving = false;

  constructor(private parameterService: ParameterService,
              private ngbModalService: NgbModal) {

  }

  ngOnInit() {
    this.load_data();
  }

  create(content) {
    this.current_item = {
      id: 0,
      name: ""
    }

    this.open_modal(content);
  }

  private load_data() {
    observableZip(
      this.parameterService.getProductCategories(),
      this.parameterService.getProducts(true),
      this.parameterService.getCurrencies(),
      (result_product_category: Result<any[]>,
        result_product: Result<any[]>,
        result_currencies : Result<any[]>) => {
        this.currencies = result_currencies.data;

        let collection = result_product_category.data;
        result_product_category.data.forEach((pc: any) => {
          pc.items = result_product.data.filter(p => p.category_id == pc.id);
        });

        this.collection = collection;
      }
    ).subscribe();
  }

  save(close_action) {
    this.saving = true;
    this.parameterService.saveProduct(this.current_item).pipe(
    delay(500))
    .subscribe(() => {
      if(close_action) {
        close_action();
      }
      this.saving = false;
      this.load_data();
    });
  }

  archive_product(product) {
    this.saving = true;
    this.parameterService.archiveProduct(product).pipe(
    delay(500))
    .subscribe(() => {
      this.saving = false;
      this.load_data();
    });
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
