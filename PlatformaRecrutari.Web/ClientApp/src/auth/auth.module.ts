import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterUserComponent } from "./register-user/register-user.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LoginUserComponent } from "./login-user/login-user.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayFormComponent } from "src/session/display-form/display-form.component";
import { SessionModule } from "src/session/session.module";

@NgModule({
  declarations: [
    RegisterUserComponent,
    LoginUserComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    NgbDropdownModule,
    SessionModule,
  ],
  exports: [RegisterUserComponent, UserProfileComponent],
})
export class AuthModule {}
