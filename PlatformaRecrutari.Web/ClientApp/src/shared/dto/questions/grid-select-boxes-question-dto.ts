import { BaseQuestionDto } from "./base-question-dto";

export interface GridSelectBoxesQuestionDto extends BaseQuestionDto {
  rows: Array<string>;
  columns: Array<string>;
  oneAnswerPerColumn: boolean;
}
