import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { HomeComponent } from "./home/home.component";
import { CounterComponent } from "./counter/counter.component";
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { AuthModule } from "../auth/auth.module";
import { RegisterUserComponent } from "../auth/register-user/register-user.component";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { LoginUserComponent } from "../auth/login-user/login-user.component";
import { JwtModule } from "@auth0/angular-jwt";
import { SessionModule } from "../session/session.module";
import { PmRoleGuard } from "../shared/guards/pm-role.guard";
import { SessionCreationManagerComponent } from "../session/session-creation-manager/session-creation-manager.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SessionManagerComponent } from "src/session/session-manager/session-manager.component";

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    AuthModule,
    SessionModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:44301"],
        blacklistedRoutes: [],
      },
    }),
    SweetAlert2Module.forRoot(),
    RouterModule.forRoot([
      { path: "", component: HomeComponent, pathMatch: "full" },
      { path: "counter", component: CounterComponent },
      { path: "fetch-data", component: FetchDataComponent },
      { path: "register-user", component: RegisterUserComponent },
      { path: "login-user", component: LoginUserComponent },
      {
        path: "sessions",
        component: SessionManagerComponent,
        canActivate: [PmRoleGuard],
      },
      {
        path: "create-session",
        component: SessionCreationManagerComponent,
        canActivate: [PmRoleGuard],
      },
    ]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
