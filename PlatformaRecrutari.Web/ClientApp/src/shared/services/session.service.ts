import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormDto } from "../dto/form-dto";
import { CreateSessionDto } from "../dto/session/create-session-dto";
import { SessionDto } from "../dto/session/get-session-dto";
import { UserInfo } from "../interfaces/user/userInfo";
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

  public updateSessionInfo(session: SessionInfo) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.updateSessionPath,
      session
    );
  }

  public getSessionById(id: number) {
    return this.http.get<SessionDto>(
      this.baseUrl + ApiCallPaths.getSessionById + id
    );
  }

  public deleteSession(body: UserInfo, sessionId: number) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.deleteSession + sessionId,
      body
    );
  }

  public getSessionForm(sessionId: number) {
    return this.http.get<FormDto>(
      this.baseUrl + ApiCallPaths.getFormFromSession + sessionId
    );
  }

  public getActiveForm() {
    return this.http.get<FormDto>(this.baseUrl + ApiCallPaths.activeFormPath);
  }

  public getActiveSession() {
    return this.http.get<SessionInfo>(
      this.baseUrl + ApiCallPaths.activeSessionPath
    );
  }
}
