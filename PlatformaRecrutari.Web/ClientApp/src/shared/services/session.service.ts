import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormDto } from "../dto/form-dto";
import { CreateSessionDto } from "../dto/session/create-session-dto";
import { SessionDto } from "../dto/session/get-session-dto";
import { FormInfo } from "../interfaces/form/formInfo";
import { UserInfo } from "../interfaces/user/userInfo";
import { WorkshopFeedback } from "../interfaces/workshop/workshop-feedback";
import { WorkshopInfo } from "../interfaces/workshop/workshop-info";
import { WorkshopSchedule } from "../interfaces/workshop/workshop-schedule";
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

  public updateForm(updatedFormInfo: FormDto) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.UpdateFormInfo,
      updatedFormInfo
    );
  }

  public postWorkshop(newWorkshop: WorkshopInfo) {
    return this.http.post<WorkshopInfo>(
      this.baseUrl + ApiCallPaths.postWorkshop,
      newWorkshop
    );
  }

  public getSessionWorkshops(sessionId: number) {
    return this.http.get<Array<WorkshopInfo>>(
      this.baseUrl + ApiCallPaths.getWorkshopsBySessionId + sessionId
    );
  }

  public deleteWorkshop(workshop: WorkshopInfo) {
    return this.http.post(this.baseUrl + ApiCallPaths.deleteWorkshop, workshop);
  }

  public getUsersForSchedule(workshop: WorkshopInfo) {
    return this.http.get<Array<UserInfo>>(
      this.baseUrl + ApiCallPaths.getUsersEligibleForSchedule + workshop.id
    );
  }

  public postWorkshopSchedule(schedule: WorkshopSchedule) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.postWorkshopSchedule,
      schedule
    );
  }

  public getWorkshopParticipants(workshopId: number) {
    return this.http.get<UserInfo[]>(
      this.baseUrl + ApiCallPaths.getWorkshopParticipantsByWSId + workshopId
    );
  }

  public getWorkshopVolunteers(workshopId: number) {
    return this.http.get<UserInfo[]>(
      this.baseUrl + ApiCallPaths.getWorkshopVolunteersByWSId + workshopId
    );
  }

  public getWorkshopCDDD(workshopId: number) {
    return this.http.get<UserInfo[]>(
      this.baseUrl + ApiCallPaths.getWorkshopCDDDByWSId + workshopId
    );
  }

  public isParticipantScheduledForWS(sessionId: number, userId: string) {
    return this.http.get<boolean>(
      this.baseUrl +
        ApiCallPaths.isParticipantScheduled +
        `${userId}/${sessionId}`
    );
  }

  public getWorkshopStatusFromParticipantAndSession(
    sessionId: number,
    participantId: string
  ) {
    return this.http.get(
      this.baseUrl +
        ApiCallPaths.getWorkshopStatusSessionIdParticipantId +
        `${participantId}/${sessionId}`,
      { responseType: "text" }
    );
  }

  public getVolunteerWhoScheduledRange(
    participants: UserInfo[],
    sessionId: number
  ) {
    return this.http.post<Array<UserInfo>>(
      this.baseUrl + ApiCallPaths.getVolunteerWhoScheduledRange + sessionId,
      participants
    );
  }

  public deleteScheduleSlot(participantId: string, workshopId: number) {
    return this.http.post(
      this.baseUrl +
        ApiCallPaths.deleteScheduleSlot +
        `${participantId}/${workshopId}`,
      {}
    );
  }

  public createWorkshopFeedback(workshopFeedback: WorkshopFeedback) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.postWorkshopFeedback,
      workshopFeedback
    );
  }

  public getWorkshopFeedback(participantId: string, workshopId: number) {
    return this.http.get<WorkshopFeedback>(
      this.baseUrl +
        ApiCallPaths.getWorkshopFeedback +
        `${participantId}/${workshopId}`
    );
  }

  public getWorkshopFeedbackBySessionId(
    participantId: string,
    sessionId: number
  ) {
    return this.http.get<WorkshopFeedback>(
      this.baseUrl +
        ApiCallPaths.getWorkshopFeedbackBySessionId +
        `${participantId}/${sessionId}`
    );
  }

  public deleteWorkshopFeedback(workshopFeedback: WorkshopFeedback) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.deleteWorkshopFeedback,
      workshopFeedback
    );
  }
}
