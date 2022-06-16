export interface BaseQuestionDto {
  id: number;
  type: string;
  position: number;
  question: string;
  required: boolean;
}
