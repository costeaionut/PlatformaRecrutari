import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateSessionDto } from "../dto/session/create-session-dto";
import { SessionDto } from "../dto/session/get-session-dto";
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

  public getAllSessions() {
    return this.http.get<Array<SessionDto>>(
      this.baseUrl + ApiCallPaths.getAllSessionsPath
    );
  }

  public getSessionById(id: number) {
    return this.http.get<SessionDto>(
      this.baseUrl + ApiCallPaths.getSessionById + id
    );
  }
}
