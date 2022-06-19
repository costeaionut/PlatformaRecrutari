import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormAnswer } from "../interfaces/form/answers/formAnswer";
import { QuestionAnswer } from "../interfaces/form/answers/questionAnswer";
import { UserInfo } from "../interfaces/user/userInfo";
import { ApiCallPaths } from "../paths/apiCallPaths";

@Injectable({
  providedIn: "root",
})
export class ParticipantsService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = ApiCallPaths.apiUrl;
  }

  public sendAnswers(formAnswer: FormAnswer) {
    return this.http.post(
      this.baseUrl + ApiCallPaths.addFormAnswrs,
      formAnswer
    );
  }

  public getSessionParticipants(sessionId: number) {
    return this.http.get<Array<UserInfo>>(
      this.baseUrl + ApiCallPaths.getSessionParticipants + `${sessionId}`
    );
  }

  public getParticipantAnswer(userId: string, formId: number) {
    return this.http.get<Array<QuestionAnswer>>(
      this.baseUrl + ApiCallPaths.getParticipantAnswer + `${userId}/${formId}`
    );
  }
}
