import { ToastrService } from "ngx-toastr";
import { Result } from "app/shared/models/result";
import { SecurityService } from "app/services/security-service";
import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-content-layout-page",
  templateUrl: "./forgot-password-page.component.html",
  styleUrls: ["./forgot-password-page.component.scss"]
})
export class ForgotPasswordPageComponent {
  @ViewChild("f")
  forgotPasswordForm: NgForm;
  saving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private toastrService: ToastrService
  ) {}

  // On submit click, reset form fields
  requestPassword() {
    if(!this.forgotPasswordForm.valid) {
      this.toastrService.error("Verifique o email informado");
      return;
    }

    this.saving = true;
    this.securityService
      .requestPasswordReset(this.forgotPasswordForm.value.inputEmail)
      .subscribe((result_data: Result) => {
        this.saving = false;
        if (!result_data.success) {
          this.toastrService.error(result_data.message);
          return;
        }

        this.forgotPasswordForm.setValue({ inputEmail: "" });
        this.toastrService.show(
          `Enviado email com o código para redefinição.`
        );
      });
  }

  // On login link click
  onLogin() {
    this.router.navigate(["login"], { relativeTo: this.route.parent });
  }
}
