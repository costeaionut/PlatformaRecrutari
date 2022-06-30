import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserInfo } from "../interfaces/user/userInfo";
import { ApiCallPaths } from "../paths/apiCallPaths";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  _baseUrl: string;
  constructor(private http: HttpClient) {
    this._baseUrl = ApiCallPaths.apiUrl;
  }

  getAllUsers() {
    return this.http.get<UserInfo[]>(
      this._baseUrl + ApiCallPaths.adminGetAllUsers
    );
  }
}
