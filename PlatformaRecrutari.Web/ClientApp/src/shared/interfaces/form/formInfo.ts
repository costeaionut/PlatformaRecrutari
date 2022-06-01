import { QuestionPosition } from "../session/question-position";

export interface FormInfo {
  id: number;
  title: string;
  description: string;
  questions: Array<QuestionPosition>;
}
