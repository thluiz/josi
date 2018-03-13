import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcquirersPageComponent } from 'app/pages/parameters/acquirers/acquirers-page.component';
import { AccountsPageComponent } from 'app/pages/parameters/accounts/accounts-page.component';
import { BranchesPageComponent } from 'app/pages/parameters/branches/branches-page.component';
import { DomainsPageComponent } from 'app/pages/parameters/domains/domains-page.component';
import { OverviewPageComponent } from 'app/pages/parameters/overview/overview-page.component';
import { PaymentMethodsPageComponent } from 'app/pages/parameters/payment-methods/payment-methods-page.component';

let routes: Routes = [
  {
    path: '',
    component: OverviewPageComponent,
    data: { },    
  },
  {
    path: 'branches',
    component: BranchesPageComponent,
    data: { },    
  },
  {
    path: 'acquirers',
    component: AcquirersPageComponent,
    data: { },    
  },
  {
    path: 'accounts',
    component: AccountsPageComponent,
    data: { },    
  },
  {
    path: 'domains',
    component: DomainsPageComponent,
    data: { },    
  },
  {
    path: 'payment-methods',
    component: PaymentMethodsPageComponent,
    data: { },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametersRoutingModule { }
