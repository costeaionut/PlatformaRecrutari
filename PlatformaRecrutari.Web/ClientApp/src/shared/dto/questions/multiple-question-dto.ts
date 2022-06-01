import { BaseQuestionDto } from "./base-question-dto";

export interface MultipleQuestionDto extends BaseQuestionDto {
  options: Array<string>;
}
