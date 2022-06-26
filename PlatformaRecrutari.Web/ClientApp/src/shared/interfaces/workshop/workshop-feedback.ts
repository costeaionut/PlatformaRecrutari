export interface WorkshopFeedback {
  workshopId: number;
  participantId: string;
  feedbackGiverId: string;
  abstainVotes: number;
  yesVotes: number;
  noVotes: number;
  feedback: string;
  status: string;
}
