import { GridMultipleQuestionDto } from "./questions/grid-multiple-question";
import { GridSelectBoxesQuestionDto } from "./questions/grid-select-boxes-question-dto";
import { MultipleQuestionDto } from "./questions/multiple-question-dto";
import { SelectBoxesQuestionDto } from "./questions/select-boxes-question-dto";
import { ShortQuestionDto } from "./questions/short-question-dto";

export interface FormDto {
  title: string;
  description: string;
  shortQuestions: ShortQuestionDto[];
  multipleQuestions: MultipleQuestionDto[];
  selectBoxesQuestions: SelectBoxesQuestionDto[];
  gridMultipleQuestions: GridMultipleQuestionDto[];
  gridSelectBoxesQuestions: GridSelectBoxesQuestionDto[];
}
