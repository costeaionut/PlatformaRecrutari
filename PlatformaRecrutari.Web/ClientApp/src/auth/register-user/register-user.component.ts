import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserRoles } from "src/shared/enums/roles-enum";
import Swal from "sweetalert2";
import { PasswordConfirmationValidatorService } from "../../shared/custom-validators/password-confirmation-validator.service";
import { UserForRegistrationDto } from "../../shared/interfaces/user/userForRegistrationDto";
import { AuthenticationService } from "../../shared/services/authentication.service";

@Component({
  selector: "app-register-user",
  templateUrl: "./register-user.component.html",
  styleUrls: ["./register-user.component.css"],
})
export class RegisterUserComponent implements OnInit {
  registerForm: FormGroup;
  public errorMessage: string = "";
  public showError: boolean;

  constructor(
    private _authService: AuthenticationService,
    private _passConfValidator: PasswordConfirmationValidatorService,
    private _router: Router
  ) {}

  ngOnInit() {
    const reg = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";
    this.registerForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [Validators.required]),
      facebookLink: new FormControl("", [
        Validators.required,
        Validators.pattern(reg),
      ]),
      profile: new FormControl("", [Validators.required]),
      class: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirm: new FormControl(""),
    });

    this.registerForm
      .get("confirm")
      .setValidators([
        Validators.required,
        this._passConfValidator.validateConfirmPassword(
          this.registerForm.get("password")
        ),
      ]);
  }

  public validateControl(controlName: string) {
    return (
      this.registerForm.controls[controlName].invalid &&
      this.registerForm.controls[controlName].touched
    );
  }
  public hasError(controlName: string, errorName: string) {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public isPhoneNumberValid(): boolean {
    let numberControl = this.registerForm.get("phoneNumber");
    let number = numberControl.value as string;

    if (number.length == 0) {
      return false;
    }

    if (number.charAt(0) != "0" || number.length != 10) {
      numberControl.setErrors({ incorrect: true });
      return true;
    }

    numberControl.setErrors(null);
    return false;
  }

  public registerUser = (registerFormValue) => {
    this.showError = false;

    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      phoneNumber: formValues.phoneNumber,
      facebook: formValues.facebookLink,
      email: formValues.email,
      profile: formValues.profile,
      class: formValues.class,
      password: formValues.password,
      confirmPassword: formValues.confirm,
      roleId: UserRoles.Candidate,
    };
    this._authService.registerUser(user).subscribe(
      (_) => {
        Swal.fire({
          icon: "success",
          title: "Your account has been created",
          showConfirmButton: true,
        }).then((result) => {
          this._router.navigate(["/"]);
        });
      },
      (error) => {
        if (error.error.errors) {
          this.showError = true;
          this.errorMessage = error.error.errors;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: "Please try again later!",
          });
        }
      }
    );
  };
}
