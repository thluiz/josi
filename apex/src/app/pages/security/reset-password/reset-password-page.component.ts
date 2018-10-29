import { Result } from "app/shared/models/result";
import { SecurityService } from "app/services/security-service";
import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-content-layout-page",
  templateUrl: "./reset-password-page.component.html",
  styleUrls: ["./reset-password-page.component.scss"]
})
export class ResetPasswordPageComponent {
  saving = false;
  @ViewChild("f")
  resetPasswordForm: NgForm;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private securityService: SecurityService
  ) {}

  // On submit click, reset form fields
  resetPassword() {
    if (!this.resetPasswordForm.valid) {
      this.toastrService.error(
        "Informe ao menos 8 caracteres para a nova senha"
      );
      return;
    }

    const pass = this.resetPasswordForm.value.inputPassword;
    const confirm = this.resetPasswordForm.value.inputPasswordConfirm;

    if (pass != confirm) {
      this.toastrService.error("Por favor, confirme a senha");
      return;
    }

    this.saving = true;
    this.securityService
      .resetPassword(this.route.snapshot.params["code"], pass, confirm)
      .subscribe((result: Result) => {
        this.saving = false;
        if (!result.success) {
          this.toastrService.error(result.message);
          return;
        }

        this.toastrService.show(
          "Senha redefinida com sucesso. \r\n Você utiliza-la para acessar o sistema agora"
        );
        this.router.navigate(["login"], { relativeTo: this.route.parent });
      });
  }

  onLogin() {
    this.router.navigate(["login"], { relativeTo: this.route.parent });
  }
}
