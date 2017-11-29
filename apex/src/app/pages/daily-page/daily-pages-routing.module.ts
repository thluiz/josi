import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DailyPageComponent } from 'app/pages/daily-page/daily-page.component';

const routes: Routes = [
  {
    path: '',
     component: DailyPageComponent,
    data: {
      title: 'Daily Page'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyPagesRoutingModule { }
