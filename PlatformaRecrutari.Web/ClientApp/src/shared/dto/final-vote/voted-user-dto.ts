import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { VotesDto } from "./votes-dto";

export interface VotedUserDto {
  participantInfo: UserInfo;
  voteStatus: string;
  votersVotes: VotesDto[];
}
