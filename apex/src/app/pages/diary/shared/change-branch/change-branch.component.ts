import { filter } from 'rxjs/operators';
import { ParameterService } from 'app/services/parameter-service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DailyMonitorDisplayType } from 'app/services/person-service';

@Component({
  selector: 'diary-change-branch',
  templateUrl: './change-branch.component.html'
})
export class DiaryChangeBranchComponent implements OnInit {

  @Input("branch") current_branch = 0;
  @Output("onChangeBranch") change_branch = new EventEmitter();
  branches = [];

  constructor(private parameterService: ParameterService) {

  }

  ngOnInit() {
    this.parameterService.getActiveBranches()
    .subscribe((result_data) => {
      this.branches = result_data.data.filter(b => b.category_id != 3);
    });
    if(!this.current_branch) {
      this.current_branch = 0;
    }
  }

  branchSelected() {
    this.change_branch.emit(this.current_branch);
  }
}
