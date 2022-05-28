import { Question } from "./question";

export class UpdateQuestion {
  questionDetails: Question;
  position: number;

  constructor(_questionDetails: Question, _position: number) {
    this.questionDetails = _questionDetails;
    this.position = _position;
  }
}
