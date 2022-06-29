import { UserInfo } from "src/shared/interfaces/user/userInfo";

export interface VotesDto {
  voterInfo: UserInfo;
  vote: string;
}
