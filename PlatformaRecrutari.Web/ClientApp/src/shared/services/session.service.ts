import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VoterPostDto } from "../dto/final-vote/voter-post-dto";
import { VoterDto } from "../dto/final-vote/voterDto";
import { FormDto } from "../dto/form-dto";
import { InterviewDto } from "../dto/interview/interviewDto";
import { CreateSessionDto } from "../dto/session/create-session-dto";
import { SessionDto } from "../dto/session/get-session-dto";
import { FormInfo } from "../interfaces/form/formInfo";
import { InterviewFeedback } from "../interfaces/interview/interview-feedback";
import { InterviewInfo } from "../interfaces/interview/interview-info";
import { InterviewSchedule } from "../interfaces/interview/interview-schedule";
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

  public editWorkshopFeedback(workshopFeedback: WorkshopFeedback) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.editWorkshopFeedback,
      workshopFeedback
    );
  }

  public postInterview(interview: InterviewInfo) {
    return this.http.post(this.baseUrl + ApiCallPaths.postInterview, interview);
  }
  public postInterviewRange(interviews: InterviewInfo[]) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.postInterviewRange,
      interviews
    );
  }

  public getInterviewById(interviewId: number) {
    return this.http.get<InterviewDto>(
      this.baseUrl + ApiCallPaths.getInterviewById + interviewId
    );
  }
  public getInterviewsBySessionId(sessionId: number) {
    return this.http.get<InterviewDto[]>(
      this.baseUrl + ApiCallPaths.getInterviewBySessionId + sessionId
    );
  }

  public deleteInterview(interview: InterviewInfo) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.deleteInterview,
      interview
    );
  }

  public updateInterview(interview: InterviewInfo) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.deleteInterview,
      interview
    );
  }

  public createInterviewSchedule(interviewSchedule: InterviewSchedule) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.postInterviewSchedule,
      interviewSchedule
    );
  }

  public deleteInterviewSchedule(interviewSchedule: InterviewSchedule) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.deleteInterviewSchedule,
      interviewSchedule
    );
  }

  public getInterviewEligibleUsers(sessionId: number) {
    return this.http.get<UserInfo[]>(
      this.baseUrl + ApiCallPaths.getInterviewEligibleUsers + `${sessionId}`
    );
  }

  public addInterviewFeedback(interviewFeedback: InterviewFeedback) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.addInterviewFeedback,
      interviewFeedback
    );
  }

  public startFinalVoteMeeting(sessionId: number) {
    return this.http.put(
      this.baseUrl + ApiCallPaths.startFinalVoteMeeting + sessionId,
      {}
    );
  }

  public requestFinalVoteParticipation(voter: VoterPostDto) {
    return this.http.post<VoterPostDto>(
      this.baseUrl + ApiCallPaths.requestFinalVoteParticipation,
      voter
    );
  }

  public changeVoterStatus(voter: VoterPostDto) {
    return this.http.put<VoterDto>(
      this.baseUrl + ApiCallPaths.changeVoterStatus,
      voter
    );
  }

  public getFinalVoteVoters(sessionId: number) {
    return this.http.get<Array<VoterDto>>(
      this.baseUrl + ApiCallPaths.getFinalVoteVoters + sessionId
    );
  }

  public getVoter(sessionId: number, voterId: string) {
    return this.http.get<VoterDto>(
      this.baseUrl + ApiCallPaths.getVoter + `${sessionId}/${voterId}`
    );
  }
}
