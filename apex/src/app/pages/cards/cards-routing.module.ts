import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsOverviewPageComponent } from 'app/pages/cards/organizations-overview-page/organizations-overview-page.component';
import { OrganizationDetailPageComponent } from 'app/pages/cards/organization-detail-page/organization-detail-page.component';
import { OrganizationConfigPageComponent } from 'app/pages/cards/organization-config-page/organization-config-page.component';


let routes: Routes = [
  {
    path: '',
    component: OrganizationsOverviewPageComponent,
    data: { },    
  },
  {
    path: 'detail/:id',
    component: OrganizationDetailPageComponent,
    data: { },    
  },
  {
    path: 'config/:id',
    component: OrganizationConfigPageComponent,
    data: { },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardsRoutingModule { }
