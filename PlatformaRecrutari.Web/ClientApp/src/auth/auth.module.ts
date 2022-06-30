import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterUserComponent } from "./register-user/register-user.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LoginUserComponent } from "./login-user/login-user.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { NgbDropdownModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayFormComponent } from "src/session/display-form/display-form.component";
import { SessionModule } from "src/session/session.module";
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    RegisterUserComponent,
    LoginUserComponent,
    UserProfileComponent,
    AdminDashboardComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SessionModule,
    NgbModalModule,
    SweetAlert2Module.forRoot(),
    NgbDropdownModule,
    ReactiveFormsModule,
  ],
  exports: [RegisterUserComponent, UserProfileComponent],
})
export class AuthModule {}
