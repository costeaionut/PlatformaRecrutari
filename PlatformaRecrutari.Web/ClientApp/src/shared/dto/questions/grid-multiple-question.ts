import { BaseQuestionDto } from "./base-question-dto";

export interface GridMultipleQuestionDto extends BaseQuestionDto {
  rows: Array<string>;
  columns: Array<string>;
  oneAnswerPerColumn: boolean;
}
