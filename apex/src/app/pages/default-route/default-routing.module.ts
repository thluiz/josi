import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultRouteComponent } from 'app/pages/default-route/default-route.component';

let routes: Routes = [
  {
    path: '',
     component: DefaultRouteComponent,    
  },
  {
    path: '**',
     component: DefaultRouteComponent,    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultRouteRoutingModule { }
