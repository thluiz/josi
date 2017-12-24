import { UnderConstructionComponent } from './under-construction.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes = [
  {
    path: '',
     component: UnderConstructionComponent,
    data: {
      title: 'Diário de Atividades'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnderConstructionRoutingModule { }
