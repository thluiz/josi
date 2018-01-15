import { MembersPanelPageComponent } from './members-panel/members-panel-page.component';
import { ManagementPanelPageComponent } from './management-panel/management-panel-page.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

let routes: Routes = [
  {
    path: '',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule { }
