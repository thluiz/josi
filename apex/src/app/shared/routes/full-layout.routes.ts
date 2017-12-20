import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer
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
  }
];
