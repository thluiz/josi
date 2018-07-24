import { OperatorConfigPageComponent } from './operator-config/operator-config-page.component';
import { OperatorPageComponent } from './operator/operator-page.component';
import { PeopleServiceProviderPageComponent } from './people-service-provider/people-service-provider-page.component';
import { InterestedPanelPageComponent } from './interested/interested-panel-page.component';
import { PeopleAwayPageComponent } from './people-away/people-away-panel-page.component';
import { MembersPanelPageComponent } from './members-panel/members-panel-page.component';
import { ManagementPanelPageComponent } from './management-panel/management-panel-page.component';
import { PersonPageComponent } from './person/person-page.component';
import { PersonEditPageComponent } from './edit/person-edit-page.component';
import { VoucherPeoplePageComponent } from './voucher/voucher-people-page.component';


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


let routes: Routes = [
  {
    path: 'members/management/:branch/:filter/:program/:domain',
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
    path: 'operator/:id',
    component: OperatorPageComponent,
  },
  {
    path: 'operator/config/:id',
    component: OperatorConfigPageComponent,
  },
  {
    path: 'interested',
    component: InterestedPanelPageComponent,
    data: { },
  },
  {
    path: 'away',
    component: PeopleAwayPageComponent,
    data: { },
  },
  {
    path: 'service_provider',
    component: PeopleServiceProviderPageComponent,
    data: { },
  },
  {
    path: 'voucher',
    component: VoucherPeoplePageComponent,
    data: { },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeopleRoutingModule { }
