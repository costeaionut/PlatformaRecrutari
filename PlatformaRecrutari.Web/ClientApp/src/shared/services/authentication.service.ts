import { UserForRegistrationDto } from "./../interfaces/user/userForRegistrationDto";
import { LoginResponseDto } from "./../interfaces/user/loginResponseDto";
import { RegistrationResponseDto } from "./../interfaces/user/registrationResponseDto";
import { ApiCallPaths } from "./../paths/apiCallPaths";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { UserForLoginDto } from "../interfaces/user/userForLoginDto";
import { Subject } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserInfo } from "../interfaces/user/userInfo";
import { NotificationService } from "./notification.service";
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  _baseUrl: string;

  public _navBarNotification: NotificationService;
  public _homeNotification: NotificationService;

  constructor(
    private http: HttpClient,
    private navBarNotification: NotificationService,
    private homeNotification: NotificationService,
    private jwtHelper: JwtHelperService
  ) {
    this._baseUrl = ApiCallPaths.apiUrl;
    this._navBarNotification = navBarNotification;
    this._homeNotification = homeNotification;
  }

  public registerUser(body: UserForRegistrationDto) {
    return this.http.post<RegistrationResponseDto>(
      this._baseUrl + ApiCallPaths.registerPath,
      body
    );
  }

  public loginUser(body: UserForLoginDto) {
    return this.http.post<LoginResponseDto>(
      this._baseUrl + ApiCallPaths.loginPath,
      body
    );
  }

  public updateUser(body: UserInfo) {
    return this.http.post<UserInfo>(
      this._baseUrl + ApiCallPaths.updateUserInfo,
      body
    );
  }

  public logoutUser() {
    localStorage.removeItem("token");
    this.sendLoginNotificationToListeners(false);
  }

  public getCurrentUser() {
    return this.http.get<UserInfo>(
      this._baseUrl + ApiCallPaths.getCurrentUserPath
    );
  }

  public getUserById(id: string) {
    return this.http.get<UserInfo>(
      this._baseUrl + ApiCallPaths.getUserById + id
    );
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");

    if (token === null) return false;

    if (token.length == 0 || this.jwtHelper.isTokenExpired(token)) return false;

    return true;
  };

  public sendLoginNotificationToListeners(isAuthenticated) {
    this.homeNotification.sendLoginStateNotification(isAuthenticated);
    this.navBarNotification.sendLoginStateNotification(isAuthenticated);
  }
}
