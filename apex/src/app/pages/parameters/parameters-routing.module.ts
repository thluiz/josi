import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcquirersPageComponent } from 'app/pages/parameters/acquirers/acquirers-page.component';
import { AccountsPageComponent } from 'app/pages/parameters/accounts/accounts-page.component';
import { BranchesPageComponent } from 'app/pages/parameters/branches/branches-page.component';
import { DomainsPageComponent } from 'app/pages/parameters/domains/domains-page.component';
import { OverviewPageComponent } from 'app/pages/parameters/overview/overview-page.component';
import { PaymentMethodsPageComponent } from 'app/pages/parameters/payment-methods/payment-methods-page.component';
import { BranchDetailPageComponent } from 'app/pages/parameters/branch-detail/branch-detail-page.component';
import { ProductsPageComponent } from 'app/pages/parameters/products/products-page.component';
import { ProductCatergoriesPageComponent } from 'app/pages/parameters/product_categories/product_categories-page.component';
import { CurrenciesPageComponent } from 'app/pages/parameters/currencies/currencies-page.component';
import { VouchersPageComponent } from 'app/pages/parameters/vouchers/vouchers-page.component';
import { VoucherDetailPageComponent } from 'app/pages/parameters/voucher-detail/voucher-detail-page.component';
import { LocationsPageComponent } from './locations/locations-page.component';

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
    path: 'products',
    component: ProductsPageComponent,
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
    path: 'locations',
    component: LocationsPageComponent,
    data: { },
  },
  {
    path: 'product_categories',
    component: ProductCatergoriesPageComponent,
    data: { },
  },
  {
    path: 'currencies',
    component: CurrenciesPageComponent,
    data: { },
  },
  {
    path: 'payment-methods',
    component: PaymentMethodsPageComponent,
    data: { },
  },
  {
    path: 'branch/:id',
    component: BranchDetailPageComponent,
    data: { },
  },
  {
    path: 'vouchers',
    component: VouchersPageComponent,
    data: { },
  },
  {
    path: 'vouchers/:id',
    component: VoucherDetailPageComponent,
    data: { },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametersRoutingModule { }
