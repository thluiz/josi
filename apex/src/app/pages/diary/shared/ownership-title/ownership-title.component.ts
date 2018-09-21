import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Ownership } from "app/shared/models/ownership";

@Component({
  selector: "ownership-title",
  templateUrl: "./ownership-title.component.html",
  styleUrls: ["./ownership-title.component.scss"]
})
export class OwnershipTitleComponent {


  @Input()
  ownership: Ownership;

  @Input()
  showStarted = true;

  @Output()
  ownershipClick = new EventEmitter<Ownership>();

  constructor() {

  }

  click(ownership) {
    this.ownershipClick.emit(ownership);
  }
}
