import { QuestionAnswer } from "./questionAnswer";

export interface FormAnswer {
  formId: number;
  candidateId: string;
  answers: QuestionAnswer[];
}
