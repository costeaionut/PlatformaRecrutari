import { InterviewInfo } from "src/shared/interfaces/interview/interview-info";
import { InterviewParticipantsInfo } from "src/shared/interfaces/interview/interview-participants-info";

export interface InterviewDto {
  interviewsDate: Date;
  interviewsDetails: InterviewInfo[];
  interviewsScheduledUsers: InterviewParticipantsInfo[];
}
