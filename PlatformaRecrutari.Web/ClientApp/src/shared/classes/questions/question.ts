import { QuestionTypes } from "../../enums/question-types-separator";

export class Question {
  private type: string;
  private required: boolean;

  public constructor(_type: string, _required: boolean = false) {
    this.type = _type;
    this.required = _required;
  }

  public setRequired = (_required: boolean) => (this.required = _required);
  public setType = (_type: string) => {
    if ((<any>Object).values(QuestionTypes).includes(_type)) {
      this.type = _type;
    } else {
      throw new Error("Question type is not existing!");
    }
  };
  public getType = () => this.type;
  public getRequired = () => this.required;
}
