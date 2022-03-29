import { UserForRegistrationDto } from './../interfaces/user/userForRegistrationDto';
import { LoginResponseDto } from './../interfaces/user/loginResponseDto';
import { RegistrationResponseDto } from './../interfaces/user/registrationResponseDto';
import { ApiCallPaths } from './../paths/apiCallPaths'
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { UserForLoginDto } from '../interfaces/user/userForLoginDto';
import { Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl: string;

  constructor(private _http: HttpClient, private _jwtHelper: JwtHelperService) {
    this.baseUrl = ApiCallPaths.apiUrl;
  }

  public registerUser(body: UserForRegistrationDto) {
    return this._http.post<RegistrationResponseDto>(this.baseUrl + ApiCallPaths.registerPath, body);
  }

  public loginUser(body: UserForLoginDto) {
    return this._http.post<LoginResponseDto>(this.baseUrl + ApiCallPaths.loginPath, body);
  }

  public getCurrentUser() {
    return this._http.get<any>(this.baseUrl + "api/Auth/GetCurrentUser");
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");

    return token && !this._jwtHelper.isTokenExpired(token);
  }

}
