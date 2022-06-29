import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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

  changeDisplay(newDisplay: string) {
    this.display = newDisplay;
  }

  startVote(participant: UserInfo) {
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
}
