import { Observable } from 'rxjs/Rx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from '../../../shared/models/location.model';
import { Result } from '../../../shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './locations-page.component.html',
  styleUrls: ['../parameters-customizations.scss']
})
export class LocationsPageComponent implements OnInit, OnDestroy {
  current_item : Location;
  collection: Location[] = [];
  saving = false;
  branches = [];
  countries = [];

  compareFn = (item1, item2) => item1 != null && item2 != null && item1.id == item2.id;

  constructor(private parameterService : ParameterService,
              private ngbModalService: NgbModal) {

  }

  ngOnInit(): void {
    this.parameterService.getLocations().subscribe((result : Result<Location[]>) => {
      this.collection = result.data;
    })
  }

  ngOnDestroy(): void {

  }

  create(content) {
    this.saving = false;
    this.current_item = new Location();
    this.open_modal(content);
  }

  edit(content, item) {
    this.saving = false;
    this.current_item = item;

    Observable.zip(
      this.parameterService.getBranches(),
      this.parameterService.getCountries(),
      (branches, countries) => {
        this.branches = branches;
        this.countries = countries;
        this.open_modal(content);
      }).subscribe();
  }

  save(close_action) {
    this.saving = true;

    this.parameterService.saveLocation(this.current_item).subscribe((data) => {
      if(close_action) {
        close_action();
      }
      this.saving = false;
      this.load_data();
    });
  }

  private open_modal(content: any) {
    this.ngbModalService.open(content).result.then((result) => {
    }, (reason) => {
      this.current_item = null;
      console.log(reason);
    });
  }

  private load_data() {
    this.parameterService.getLocations(true).subscribe((result : Result<Location[]>) => {
      this.collection = result.data;
    });
  }
}
