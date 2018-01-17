import { Routes, RouterModule } from '@angular/router';

export const Full_ROUTES: Routes = [
  {
    path: 'changelog',
    loadChildren: './changelog/changelog.module#ChangeLogModule'
  },
  {
    path: 'full-layout',
    loadChildren: './pages/full-layout-page/full-pages.module#FullPagesModule'
  },
  {
    path: 'daily',
    loadChildren: './pages/daily/daily.module#DailyModule'
  },
  {
    path: 'daily/day',
    loadChildren: './pages/daily/daily.module#DailyModule'
  },
  {
    path: 'daily/week',
    loadChildren: './pages/daily/daily.module#DailyModule'
  },
  {
    path: 'daily/agenda',
    loadChildren: './pages/daily/daily.module#DailyModule'
  },
  {
    path: 'people',
    loadChildren: './pages/people/people.module#PeopleModule'
  },
  {
    path: 'people/members',
    loadChildren: './pages/people/people.module#PeopleModule'
  },
  {
    path: 'person/edit/:id',
    loadChildren: './pages/people/edit/person-edit-page.module#PersonEditPageModule'
  },
  {
    path: 'person/:id',
    loadChildren: './pages/people/person/person-page.module#PersonPageModule'
  },
  {
    path: 'under-construction',
    loadChildren: './pages/under-construction/under-construction.module#UnderConstructionModule'
  }
];
