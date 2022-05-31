import { QuestionPosition } from "../session/question-position";

export interface FormInfo {
  title: String;
  description: String;
  questions: Array<QuestionPosition>;
}
