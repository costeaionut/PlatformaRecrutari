import { UserInfo } from "../user/userInfo";

export interface InterviewParticipantsInfo {
  interviewId: number;
  schedulerId: string;
  participant: UserInfo;
  hr: UserInfo;
  dd: UserInfo;
  cd: UserInfo;
}
