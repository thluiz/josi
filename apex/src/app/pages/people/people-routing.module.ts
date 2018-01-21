import { MembersPanelPageComponent } from './members-panel/members-panel-page.component';
import { ManagementPanelPageComponent } from './management-panel/management-panel-page.component';
import { PersonPageComponent } from './person/person-page.component';
import { PersonEditPageComponent } from './edit/person-edit-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


let routes: Routes = [
  {
    path: 'people',
    component: ManagementPanelPageComponent,
    data: {
      title: 'Painel de Gerência de Membros'
    },    
  },
  {
    path: 'members',
    component: MembersPanelPageComponent,
    data: {
      title: 'Painel de Membros'
    },    
  }, 
  {
    path: 'person/:id',
    component: PersonPageComponent,
    data: {
      title: 'Detalhe da Pessoa'
    },    
  },
  {
    path: 'person/edit/:id',
    component: PersonEditPageComponent,
    data: {
      title: 'Detalhe da Pessoa'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule { }
