import { BaseQuestionDto } from "./base-question-dto";

export interface SelectBoxesQuestionDto extends BaseQuestionDto {
  options: Array<string>;
}
