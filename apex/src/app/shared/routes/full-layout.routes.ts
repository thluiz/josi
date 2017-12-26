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
    path: 'outlook/weekly',
    loadChildren: './pages/outlook/weekly-page/weekly-pages.module#WeeklyPagesModule'
  },
  {
    path: 'outlook/sumary',
    loadChildren: './pages/outlook/sumary-page/sumary-pages.module#SumaryPagesModule'
  },
  {
    path: 'people',
    loadChildren: './pages/people/list/people-list-page.module#PeopleListPageModule'
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
