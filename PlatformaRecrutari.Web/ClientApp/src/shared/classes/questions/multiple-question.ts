import { Question } from "./question";

export class MultipleQuestion extends Question {
  private question: String;
  private options: Array<String>;

  constructor(_question: String, _options: Array<String>, _required?: boolean) {
    super("MultipleQuestion", _required);
    this.question = _question;
    this.options = _options;
  }

  public setQuestion = (_question: String): void => {
    this.question = _question;
  };
  public getQuestion = (): String => {
    return this.question;
  };

  public setOptions = (_options: Array<String>): void => {
    this.options = _options;
  };
  public getOptions = (): Array<String> => {
    return this.options;
  };
}
