import { InterviewInfo } from "src/shared/interfaces/interview/interview-info";

export interface InterviewDto {
  interviewsDate: Date;
  interviewsDetails: InterviewInfo[];
}
