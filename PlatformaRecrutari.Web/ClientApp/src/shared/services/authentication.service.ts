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

  constructor(private _http: HttpClient) {
    this.baseUrl = ApiCallPaths.apiUrl;
  }

  public registerUser(body: UserForRegistrationDto) {
    return this._http.post<RegistrationResponseDto>(this.baseUrl + ApiCallPaths.registerPath, body);
  }
}
