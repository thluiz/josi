import { AgendaPageComponent } from './agenda-page/agenda-page.component';
import { WeeklyPageComponent } from './weekly-page/weekly-page.component';
import { DailyPageComponent } from './daily-page/daily-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: WeeklyPageComponent,    
  },
  {
    path: 'week',
    component: WeeklyPageComponent,    
  },
  {
    path: 'day',
    component: DailyPageComponent,    
  },
  {
    path: 'agenda',
    component: AgendaPageComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyRoutingModule { }
