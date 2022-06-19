import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormAnswer } from "../interfaces/form/answers/formAnswer";
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
}
