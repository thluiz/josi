import { PeopleListPageComponent } from './people-list-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes = [
  {
    path: '',
     component: PeopleListPageComponent,
    data: {
      title: 'Lista de Pessoas'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleListRoutingModule { }
