import { AgendaPageComponent } from './agenda-page/agenda-page.component';
import { WeeklyPageComponent } from './weekly-page/weekly-page.component';
import { DailyPageComponent } from './daily-page/daily-page.component';
import { CurrentActivitiesPageComponent } from 'app/pages/diary/current-activities-page/current-activities-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: AgendaPageComponent,    
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
  },
  {
    path: 'current_activities',
    component: CurrentActivitiesPageComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiaryRoutingModule { }
