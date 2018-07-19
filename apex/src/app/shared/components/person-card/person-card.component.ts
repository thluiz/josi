import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PersonCardComponent implements OnInit {

  @Input() person: any;
  @Input() showContacts = false;
  @Input() useContactButton = false;
  @Input() hideCommunicationStatus = false;
  @Input() hideScheduleStatus = false;
  @Input() hideFinancialStatus = false;
  @Input() hideDataStatus = false;
  @Input() editAvatarOnClick = false;

  constructor() {

  }

  ngOnInit() {

  }
}