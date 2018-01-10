import { DailyPageComponent } from './daily-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DailyPageComponent,
    data: {
      title: 'Diário de Atividades'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyPagesRoutingModule { }
