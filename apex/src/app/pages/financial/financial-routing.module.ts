import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewPageComponent } from 'app/pages/financial/overview/overview-page.component';


let routes: Routes = [
  {
    path: '',
    component: OverviewPageComponent,
    data: { },    
  },
  {
    path: ':branch_id',
    component: OverviewPageComponent,
    data: { },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialRoutingModule { }
