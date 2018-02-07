import { MembersPanelPageComponent } from './members-panel/members-panel-page.component';
import { ManagementPanelPageComponent } from './management-panel/management-panel-page.component';
import { PersonPageComponent } from './person/person-page.component';
import { PersonEditPageComponent } from './edit/person-edit-page.component';
import { InterestedPanelPageComponent } from 'app/pages/people/interested/interested-panel-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


let routes: Routes = [
  {
    path: 'members/management/:branch/:filter',
    component: ManagementPanelPageComponent,
    data: {
      title: 'Painel de Gerência de Membros'
    },    
  },
  {
    path: 'members/management',
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
  },
  {
    path: 'interested',
    component: InterestedPanelPageComponent,
    data: { },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule { }
