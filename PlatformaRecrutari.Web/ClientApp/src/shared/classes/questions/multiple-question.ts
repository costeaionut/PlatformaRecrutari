import { Question } from "./question";

export class MultipleQuestion extends Question {
  private question: string;
  private options: Array<string>;

  constructor(_question: string, _options: Array<string>, _required?: boolean) {
    super("MultipleQuestion", _required);
    this.question = _question;
    this.options = _options;
  }

  public setQuestion = (_question: string): void => {
    this.question = _question;
  };
  public getQuestion = (): string => {
    return this.question;
  };

  public setOptions = (_options: Array<string>): void => {
    this.options = _options;
  };
  public getOptions = (): Array<string> => {
    return this.options;
  };
}
