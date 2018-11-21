import { CoveragePageComponent } from './coverage-page/coverage-page.component';
import { EventsPageComponent } from './events-page/events-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes = [
  {
    path: 'coverage',
    component: CoveragePageComponent,
    data: { },
  },
  {
    path: 'events',
    component: EventsPageComponent,
    data: { },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule { }
