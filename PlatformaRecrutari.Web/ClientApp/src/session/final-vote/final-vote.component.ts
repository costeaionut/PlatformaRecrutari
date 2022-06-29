import { ViewportRuler } from "@angular/cdk/scrolling";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { swalProviderToken } from "@sweetalert2/ngx-sweetalert2/lib/di";
import { VotedUserDto } from "src/shared/dto/final-vote/voted-user-dto";
import { VotedUserPostDto } from "src/shared/dto/final-vote/voted-user-post-dto";
import { VoterPostDto } from "src/shared/dto/final-vote/voter-post-dto";
import { VoterDto } from "src/shared/dto/final-vote/voterDto";
import { VotesDto } from "src/shared/dto/final-vote/votes-dto";
import { VotePostDto } from "src/shared/dto/final-vote/votes-post-dto";
import { ParticipantsDto } from "src/shared/dto/participant-dto";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { AuthenticationService } from "src/shared/services/authentication.service";
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
  currentUser: UserInfo;

  waitingForVote: UserInfo;
  notVotedParticipants: UserInfo[];
  votedParticipants: VotedUserDto[];

  voters: VoterDto[];

  display: string;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private sessionService: SessionService,
    private authService: AuthenticationService,
    private participantsService: ParticipantsService
  ) {}

  async ngOnInit() {
    this.display = "NotVoted";
    this.waitingForVote = undefined;
    this.votedParticipants = [];
    this.notVotedParticipants = [];
    this.currentUser = await this.authService.getCurrentUser().toPromise();
    this.session = await this.sessionService
      .getSessionById(parseInt(this.route.snapshot.paramMap.get("sessionId")))
      .toPromise();

    await this.getVotedUsers();
    await this.getVoters();

    let allParticipants: ParticipantsDto[] = await this.participantsService
      .getSessionParticipants(this.session.id)
      .toPromise();
    allParticipants.forEach((participant) => {
      let addedInApproved: boolean = false;
      this.votedParticipants.forEach((voted, votedIndex) => {
        if (voted.voteStatus == "Waiting") {
          this.waitingForVote = voted.participantInfo;
          this.votedParticipants.splice(votedIndex, 1);
        } else if (participant.user.id == voted.participantInfo.id) {
          addedInApproved = true;
        }
      });
      if (!addedInApproved) this.notVotedParticipants.push(participant.user);
    });
  }

  async getVoters() {
    this.voters = await this.sessionService
      .getFinalVoteVoters(this.session.id)
      .toPromise();
  }

  async getVotedUsers() {
    this.votedParticipants = await this.sessionService
      .getSessionVotedUsers(this.session.id)
      .toPromise();
  }

  changeDisplay(newDisplay: string) {
    this.display = newDisplay;
  }

  startVoteForUser(participant: UserInfo) {
    let votedUser: VotedUserPostDto = {
      participantId: participant.id,
      sessionId: this.session.id,
      status: "Waiting",
    };

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
        this.sessionService.addVotedParticipant(votedUser).subscribe(
          (res) => {
            Swal.fire({
              title: "Vote started",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            }).then(async (_) => {
              await this.ngOnInit();
              this.changeDisplay("Volunteers");
            });
          },
          (err) => {
            Swal.fire({
              title: "There was an error...\nVote didn't start",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        );
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

  changeVoterStatus(status: string, voter: VoterDto, index: number) {
    let voterDto: VoterPostDto = {
      volunteerId: voter.user.id,
      sessionId: this.session.id,
      status: status,
    };
    this.sessionService.changeVoterStatus(voterDto).subscribe((res) => {
      if (status == "Approved") {
        Swal.fire({
          title: "Volunteer approved for this session!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          title: "Volunteer rejected for this session!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });
      }
      this.voters[index] = res;
    });
  }

  stopVoteForUser(participant: UserInfo) {
    Swal.fire({
      title: "Has everybody voted?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .stopVoteAndCalculateResult(participant, this.session.id)
          .subscribe((_res) => {
            Swal.fire({
              title: "Vote closed!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(async (_res) => {
              await this.ngOnInit();
              this.changeDisplay("Voted");
            });
          });
    });
  }

  async voteParticipant() {
    var waitingUser = await this.sessionService
      .getParticipantWaitingForVote(this.session.id)
      .toPromise();
    this.waitingForVote = waitingUser;
    if (waitingUser == null) {
      Swal.fire({
        title: "There is no pending vote!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: `Do you want to approve or reject ${this.waitingForVote.firstName}`,
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "red",
        cancelButtonText: "Reject",
        confirmButtonColor: "green",
        confirmButtonText: "Approve",
      }).then((res) => {
        let response: string;
        if (res.value) {
          response = "Yes";
        } else {
          response = "No";
        }
        let vote: VotePostDto = {
          voterId: this.currentUser.id,
          participantId: this.waitingForVote.id,
          sessionId: this.session.id,
          response: response,
        };

        this.sessionService.postMyVote(vote).subscribe(
          (res) => {
            Swal.fire({
              title: "Your vote was saved!",
              timer: 1500,
              icon: "success",
              showConfirmButton: false,
            });
          },
          (err) => {
            if (err.error == "VolunteerAlreadyVoted")
              Swal.fire({
                title: "You have already voted!",
                text: "Do you want to delete your vote and vote again?",
                icon: "error",
                showCancelButton: true,
                cancelButtonColor: "red",
                cancelButtonText: "No",
                confirmButtonColor: "green",
                confirmButtonText: "Yes",
              }).then((res) => {
                if (res.value)
                  this.sessionService
                    .deleteMyVote(
                      this.session.id,
                      this.participantFinalVote.participantInfo,
                      this.currentUser.id
                    )
                    .subscribe(
                      (res) => {
                        Swal.fire({
                          title: `Do you want to approve or reject ${this.waitingForVote.firstName}`,
                          icon: "question",
                          showCancelButton: true,
                          cancelButtonColor: "red",
                          cancelButtonText: "Reject",
                          confirmButtonColor: "green",
                          confirmButtonText: "Approve",
                        }).then((res) => {
                          let response: string;
                          if (res.value) {
                            response = "Yes";
                          } else {
                            response = "No";
                          }
                          let vote: VotePostDto = {
                            voterId: this.currentUser.id,
                            participantId: this.waitingForVote.id,
                            sessionId: this.session.id,
                            response: response,
                          };
                          this.sessionService.postMyVote(vote).subscribe(
                            (res) => {
                              Swal.fire({
                                title: "Your vote was saved!",
                                timer: 1500,
                                icon: "success",
                                showConfirmButton: false,
                              });
                            },
                            (err) => {
                              Swal.fire({
                                title:
                                  "There was an error saving your vote...\nPlease try again later",
                                icon: "error",
                                showConfirmButton: false,
                                timer: 2000,
                              });
                            }
                          );
                        });
                      },
                      (err) => {
                        Swal.fire({
                          title: "Your vote couldn't be deleted...",
                          icon: "error",
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      }
                    );
              });
          }
        );
      });
    }
  }

  volunteersVotesFinalVote: VotesDto[];
  participantFinalVote: VotedUserDto;
  openFinalVoteInfo(modal, participant: VotedUserDto) {
    this.volunteersVotesFinalVote = [];
    this.participantFinalVote = participant;

    this.voters.forEach((voterFromAllVoters) => {
      let hasVoted: boolean = false;
      this.participantFinalVote.votersVotes.forEach((voterWhoVoted) => {
        if (voterFromAllVoters.user.id == voterWhoVoted.voterInfo.id) {
          hasVoted = true;
          this.volunteersVotesFinalVote.push(voterWhoVoted);
        }
      });
      if (!hasVoted && voterFromAllVoters.status == "Approved") {
        let abstainedVoter: VotesDto = {
          voterInfo: voterFromAllVoters.user,
          vote: "Abstain",
        };
        this.volunteersVotesFinalVote.push(abstainedVoter);
      }
    });

    this.participantFinalVote = participant;
    this.modalService.open(modal, { centered: true, size: "lg" });
  }
  deleteFinalVote() {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, the vote has to be made again",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .deleteParticipantFinalVote(
            this.session.id,
            this.participantFinalVote.participantInfo
          )
          .subscribe(
            (res) => {
              Swal.fire({
                title: "Vote deleted!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(async (_res) => {
                await this.ngOnInit();
                this.modalService.dismissAll();
              });
            },
            (err) => {
              Swal.fire({
                title:
                  "Sorry something went wrong...\nWe couldn't delete your vote!",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          );
    });
  }
}
