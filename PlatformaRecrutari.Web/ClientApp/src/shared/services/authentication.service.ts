import { UserForRegistrationDto } from './../interfaces/user/userForRegistrationDto';
import { RegistrationResponseDto } from './../interfaces/user/registrationResponseDto';
import { ApiCallPaths } from './../paths/apiCallPaths'
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl: string;

  constructor(private _http: HttpClient, @Inject('BASE_URL') _baseUrl: string) {
    this.baseUrl = _baseUrl;
  }

  public registerUser(body: UserForRegistrationDto) {
    return this._http.post<RegistrationResponseDto>(this.baseUrl + ApiCallPaths.registerPath, body);
  }
}
