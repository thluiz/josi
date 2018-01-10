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
    loadChildren: './pages/outlook/weekly-page/weekly-pages.module#WeeklyPagesModule'
  },
  {
    path: 'outlook/weekly',
    loadChildren: './pages/outlook/weekly-page/weekly-pages.module#WeeklyPagesModule'
  },
  {
    path: 'outlook/daily',
    loadChildren: './pages/outlook/daily-page/daily-pages.module#DailyPagesModule'
  },
  {
    path: 'outlook/sumary',
    loadChildren: './pages/outlook/sumary-page/sumary-pages.module#SumaryPagesModule'
  },
  {
    path: 'outlook/summary',
    loadChildren: './pages/outlook/sumary-page/sumary-pages.module#SumaryPagesModule'
  },
  {
    path: 'people',
    loadChildren: './pages/people/list/people-list-page.module#PeopleListPageModule'
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
