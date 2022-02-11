import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoginUserComponent } from './login-user/login-user.component';



@NgModule({
  declarations: [RegisterUserComponent, LoginUserComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [RegisterUserComponent]
})
export class AuthModule { }
