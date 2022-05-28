import { Question } from "./question";

export class ShortQuestion extends Question {
  private question: String;

  constructor(_question: String, _required: boolean = false) {
    super("ShortQuestion", _required);
    this.question = _question;
  }

  public getQuestion = () => this.question;
  public setQuestion = (_question: String) => (this.question = _question);
}
