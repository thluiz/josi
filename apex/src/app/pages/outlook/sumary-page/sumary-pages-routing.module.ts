import { SumaryPageComponent } from './sumary-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes = [
  {
    path: '',
    component: SumaryPageComponent,
    data: {
      title: 'Sumário de Atividades'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SumaryPagesRoutingModule { }
