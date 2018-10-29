import { Routes, RouterModule } from "@angular/router";

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const SECURITY_ROUTES: Routes = [
  {
    path: "login_error",
    loadChildren: "./pages/login_error/login-error.module#LoginErrorModule"
  },
  {
    path: "security",
    loadChildren: "./pages/security/security-pages.module#SecurityPagesModule"
  },
  {
    path: "security/login",
    loadChildren: "./pages/security/security-pages.module#SecurityPagesModule"
  },
  {
    path: "security/forgotpassword",
    loadChildren: "./pages/security/security-pages.module#SecurityPagesModule"
  },
  {
    path: "security/resetpassword/:code",
    loadChildren: "./pages/security/security-pages.module#SecurityPagesModule"
  },
  {
    path: "security/load_login",
    loadChildren: "./pages/security/security-pages.module#SecurityPagesModule"
  },
  {
    path: "default_route",
    loadChildren:
      "./pages/default-route/default-route.module#DefaultRouteModule"
  }
];
