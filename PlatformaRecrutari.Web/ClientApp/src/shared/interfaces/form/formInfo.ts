import { QuestionPosition } from "../session/question-position";

export interface FormInfo {
  title: string;
  description: string;
  questions: Array<QuestionPosition>;
}
