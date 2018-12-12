import { LoadLoginComponent } from './load-login-data/load-login-data.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ForgotPasswordPageComponent } from "./forgot-password/forgot-password-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { ResetPasswordPageComponent } from "./reset-password/reset-password-page.component";

const routes: Routes = [
  {
    path: "forgotpassword",
    component: ForgotPasswordPageComponent,
    data: {
      title: "Forgot Password"
    }
  },
  {
    path: "resetpassword/:code",
    component: ResetPasswordPageComponent,
    data: {
      title: "Reset Password"
    }
  },
  {
    path: "login",
    component: LoginPageComponent,
    data: {
      title: "Login"
    }
  },
  {
    path: "load_login",
    component: LoadLoginComponent,
    data: {
      title: "Loading... "
    }
  },
  {
    path: "",
    component: LoginPageComponent,
    data: {
      title: "Login Page"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityPagesRoutingModule {}
