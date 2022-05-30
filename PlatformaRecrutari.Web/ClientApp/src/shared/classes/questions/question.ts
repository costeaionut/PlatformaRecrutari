import { QuestionTypes } from "../../enums/question-types-separator";

export class Question {
  private type: String;
  private required: boolean;

  public constructor(_type: String, _required: boolean = false) {
    this.type = _type;
    this.required = _required;
  }

  public setRequired = (_required: boolean) => (this.required = _required);
  public setType = (_type: String) => {
    if ((<any>Object).values(QuestionTypes).includes(_type)) {
      this.type = _type;
    } else {
      throw new Error("Question type is not existing!");
    }
  };
  public getType = () => this.type;
  public getRequired = () => this.required;
}
