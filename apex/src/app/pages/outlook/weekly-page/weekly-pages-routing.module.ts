import { WeeklyPageComponent } from './weekly-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: WeeklyPageComponent,
    data: {
      title: 'Diário de Atividades'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WeeklyPagesRoutingModule { }
