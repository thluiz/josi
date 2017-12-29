import { PersonEditPageComponent } from './person-edit-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes = [
  {
    path: '',
    component: PersonEditPageComponent,
    data: {
      title: 'Edição de Pessoa'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonEditRoutingModule { }
