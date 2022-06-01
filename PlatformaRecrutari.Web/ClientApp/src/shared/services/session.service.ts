import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateSessionDto } from "../dto/create-session-dto";
import { ApiCallPaths } from "./../paths/apiCallPaths";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = ApiCallPaths.apiUrl;
  }

  public createSession(body: CreateSessionDto) {
    return this.http.post<any>(
      this.baseUrl + ApiCallPaths.createSessionPath,
      body
    );
  }
}
