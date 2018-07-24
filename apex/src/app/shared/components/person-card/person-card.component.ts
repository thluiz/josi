import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

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
  @Input() hidePinnedComments = true;
  @Input() editAvatarOnClick = false;

  constructor() {

  }

  ngOnInit() {

  }
}