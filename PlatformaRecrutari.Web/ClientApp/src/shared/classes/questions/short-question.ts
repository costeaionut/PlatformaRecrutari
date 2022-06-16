import { Question } from "./question";

export class ShortQuestion extends Question {
  private question: string;

  constructor(_question: string, _required: boolean = false) {
    super("ShortQuestion", _required);
    this.question = _question;
  }

  public setId = (_id: number): void => super.setId(_id);
  public getId = () => super.getId();

  public getQuestion = () => this.question;
  public setQuestion(_question: string) {
    this.question = _question;
  }
}
