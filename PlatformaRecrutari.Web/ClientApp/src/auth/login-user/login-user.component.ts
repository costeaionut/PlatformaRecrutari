import { UserForLoginDto } from "./../../shared/interfaces/user/userForLoginDto";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "./../../shared/services/authentication.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import Swal from "sweetalert2";
@Component({
  selector: "app-login-user",
  templateUrl: "./login-user.component.html",
  styleUrls: ["./login-user.component.css"],
})
export class LoginUserComponent implements OnInit {
  public loginForm: FormGroup;
  public submittingForm: boolean;
  public errorMessage: string = "";
  public showError: boolean;
  private _returnUrl: string;

  constructor(
    private _authService: AuthenticationService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
    this._returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";
    this.submittingForm = false;
  }

  public validateControl(controlName: string) {
    return (
      this.loginForm.controls[controlName].invalid &&
      this.loginForm.controls[controlName].touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  public loginUser(loginFormValue) {
    this.submittingForm = true;
    this.showError = false;
    const login = { ...loginFormValue };
    const userForAuth: UserForLoginDto = {
      email: login.email,
      password: login.password,
    };

    this._authService.loginUser(userForAuth).subscribe(
      (res) => {
        localStorage.setItem("token", res.token);
        this._authService.sendLoginNotificationToListeners(
          res.isAuthSuccessful
        );

        this._router.navigate([this._returnUrl]);
        this.submittingForm = false;
      },
      (error) => {
        if (error.status == 401) {
          this.showError = true;
          this.errorMessage = "Email or Password are invalid!";
          this.submittingForm = false;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          }).then((_) => {
            this.submittingForm = false;
          });
        }
      }
    );
  }
}
