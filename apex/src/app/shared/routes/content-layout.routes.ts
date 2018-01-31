import { Routes, RouterModule } from '@angular/router';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [
    {
        path: 'content-layout',
        loadChildren: './pages/content-layout-page/content-pages.module#ContentPagesModule'
    },
    {
        path: 'login_error',
        loadChildren: './pages/login_error/login-error.module#LoginErrorModule'
    } 
];