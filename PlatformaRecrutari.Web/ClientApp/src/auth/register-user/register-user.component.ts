import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PasswordConfirmationValidatorService } from '../../shared/custom-validators/password-confirmation-validator.service';
import { UserForRegistrationDto } from '../../shared/interfaces/user/userForRegistrationDto';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  registerForm: FormGroup
  public errorMessage: string = ''
  public showError: boolean

  constructor(
    private _authService: AuthenticationService,
    private _passConfValidator: PasswordConfirmationValidatorService,
    private _router: Router
  ) {
  }

  ngOnInit() {

    this.registerForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });

    this.registerForm.get('confirm').setValidators([Validators.required, this._passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);
  }

  public validateControl(controlName: string) {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched
  }
  public hasError(controlName: string, errorName: string) {
    return this.registerForm.controls[controlName].hasError(errorName)
  }

  public registerUser = (registerFormValue) => {

    this.showError = false

    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm,
      roleId: 1
    };
    this._authService.registerUser(user)
      .subscribe(_ => {
        Swal.fire({
          icon: 'success',
          title: 'Your account has been created',
          showConfirmButton: true,
        }).then((result) => {
          this._router.navigate(['/'])
        })
      },
        error => {
          this.showError = true
          this.errorMessage = error.error.errors
        }
      )
  }
}
