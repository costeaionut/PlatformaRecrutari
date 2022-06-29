import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { VoterDto } from "src/shared/dto/final-vote/voterDto";
import { ParticipantsDto } from "src/shared/dto/participant-dto";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { ParticipantsService } from "src/shared/services/participants.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-final-vote",
  templateUrl: "./final-vote.component.html",
  styleUrls: ["./final-vote.component.css"],
})
export class FinalVoteComponent implements OnInit {
  session: SessionInfo;
  notVotedParticipants: UserInfo[];

  votedParticipants: UserInfo[];
  votedParticipantsStatus: string[];

  voters: VoterDto[];

  display: string;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private participantsService: ParticipantsService
  ) {}

  async ngOnInit() {
    this.display = "NotVoted";
    this.votedParticipants = [];
    this.votedParticipantsStatus = [];
    this.notVotedParticipants = [];
    this.session = await this.sessionService
      .getSessionById(parseInt(this.route.snapshot.paramMap.get("sessionId")))
      .toPromise();

    await this.getVoters();

    let allParticipants: ParticipantsDto[] = await this.participantsService
      .getSessionParticipants(this.session.id)
      .toPromise();
    allParticipants.forEach((participant) => {
      if (participant.status == "Ready for final vote")
        this.notVotedParticipants.push(participant.user);
      if (participant.status == "Rejected") {
        this.votedParticipants.push(participant.user);
        this.votedParticipantsStatus.push("Rejected");
      }
      if (participant.status == "Approver") {
        this.votedParticipants.push(participant.user);
        this.votedParticipantsStatus.push("Approved");
      }
    });
  }

  async getVoters() {
    this.voters = await this.sessionService
      .getFinalVoteVoters(this.session.id)
      .toPromise();
  }

  changeDisplay(newDisplay: string) {
    this.display = newDisplay;
  }

  startVoteForUser(participant: UserInfo) {
    Swal.fire({
      title: `Start vote for ${participant.firstName} ${participant.lastName}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.value)
        Swal.fire({
          title: "Vote started",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
    });
  }

  startFinalVoteMeeting() {
    Swal.fire({
      title: "Are you sure?",
      text: "The meeting will be closed only when all the participants have been voted",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.value)
        this.sessionService.startFinalVoteMeeting(this.session.id).subscribe(
          (_res) => {
            Swal.fire({
              title: "Meeting started!",
              text: "Volunteers can now join",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(async (_) => {
              this.session = await this.sessionService
                .getSessionById(this.session.id)
                .toPromise();
            });
          },
          (err) => {
            Swal.fire({
              title: "There was an error...",
              text: "We couldn't start the meeting. Please try again",
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
    });
  }
}
