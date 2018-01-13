import { PeopleList2PageComponent } from './people-list-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes = [
  {
    path: '',
     component: PeopleList2PageComponent,
    data: {
      title: 'Lista de Pessoas'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleList2RoutingModule { }
