import { Question } from "./question";

export class LongQuestion extends Question {
  private question: String;

  constructor(_question: String, _required: Boolean = false) {
    super("LongQuestion", _required);
    this.question = _question;
  }

  public getQuestion = () => this.question;
  public setQuestion = (_question: String) => (this.question = _question);
}
