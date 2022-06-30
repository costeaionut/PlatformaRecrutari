import { getTreeNoValidDataSourceError } from "@angular/cdk/tree";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormFeedbackResponse } from "src/shared/dto/feedback/response-form-feedback";
import { FormFeedbackPost } from "src/shared/dto/feedback/send-form-feedback";
import { VoterPostDto } from "src/shared/dto/final-vote/voter-post-dto";
import { VoterDto } from "src/shared/dto/final-vote/voterDto";
import { FormDto } from "src/shared/dto/form-dto";
import { ParticipantsDto } from "src/shared/dto/participant-dto";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { WorkshopFeedback } from "src/shared/interfaces/workshop/workshop-feedback";
import { WorkshopInfo } from "src/shared/interfaces/workshop/workshop-info";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { ParticipantsService } from "src/shared/services/participants.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-display-sessions",
  templateUrl: "./display-sessions.component.html",
  styleUrls: ["./display-sessions.component.css"],
})
export class DisplaySessionsComponent implements OnInit {
  currentSession: SessionInfo;
  currentForm: FormInfo;

  creator: UserInfo;
  whatToDisplay: string;

  currentUser: UserInfo;
  participatesInFinalVote: boolean;
  currentUserVoter: VoterDto;

  editingSession: boolean;
  invalidSession: boolean;

  editingForm: boolean;
  invalidForm: boolean;

  participants: Array<UserInfo>;
  participantsStatus: Array<string>;

  constructor(
    private participantsService: ParticipantsService,
    private authService: AuthenticationService,
    private mapperService: DtoMapperService,
    private sessionService: SessionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.whatToDisplay = "candidates";
    this.editingSession = false;
    this.editingForm = false;
    this.currentSession = await this.sessionService
      .getSessionById(id)
      .toPromise();

    let currentFormDto: FormDto = await this.sessionService
      .getSessionForm(this.currentSession.id)
      .toPromise();

    this.currentForm = this.mapperService.mapFormDtoToFormInfo(currentFormDto);

    this.creator = await this.authService
      .getUserById(this.currentSession.creatorId)
      .toPromise();

    this.currentUser = await this.authService.getCurrentUser().toPromise();
    let participantsDto: ParticipantsDto[] = await this.participantsService
      .getSessionParticipants(this.currentSession.id)
      .toPromise();

    await this.getCurrentUserFinalVoteParticipationStatus();

    this.getParticipantsStatus(participantsDto);
    this.orderParticipantsByWaitingStatus();
  }

  async getCurrentUserFinalVoteParticipationStatus() {
    if (this.currentSession.isFinalVoteStarted) {
      let voterDto: VoterDto = await this.sessionService
        .getVoter(this.currentSession.id, this.currentUser.id)
        .toPromise();
      this.currentUserVoter = voterDto;
      if (voterDto == null) {
        this.participatesInFinalVote = false;
      } else {
        this.participatesInFinalVote = true;
      }
    }
  }

  getParticipantsStatus(participants: ParticipantsDto[]) {
    this.participants = new Array<UserInfo>();
    this.participantsStatus = new Array<string>();
    participants.forEach((participant) => {
      this.participants.push(participant.user);
      this.participantsStatus.push(participant.status);
    });
  }

  goToUserProfile(userIndex: number) {
    let userGuid: string = this.participants[userIndex].id;
    this.router.navigate([`/user/${userGuid}`]);
  }

  orderParticipantsByWaitingStatus() {
    let waitingFormUsers: UserInfo[] = [];
    let passedFormUsers: UserInfo[] = [];
    let rejectedFormUsers: UserInfo[] = [];

    let waitingScheduleWorkshopUsers: UserInfo[] = [];
    let scheduledWorkshopUsers: UserInfo[] = [];
    let waitingWorkshopFeedbackUsers: UserInfo[] = [];
    let passedWorkshopUsers: UserInfo[] = [];
    let rejectedWorkshopUsers: UserInfo[] = [];

    let waitingScheduleInterviewUsers: UserInfo[] = [];
    let scheduledInterviewUsers: UserInfo[] = [];
    let waitingInterviewFeedbackUsers: UserInfo[] = [];
    let finalVoteUsers: UserInfo[] = [];

    let waitingFormStatus: string[] = [];
    let passedFormStatus: string[] = [];
    let rejectedFormStatus: string[] = [];

    let waitingScheduleWorkshopStatus: string[] = [];
    let scheduledWorkshopStatus: string[] = [];
    let waitingWorkshopFeedbackStatus: string[] = [];
    let passedWorkshopStatus: string[] = [];
    let rejectedWorkshopStatus: string[] = [];

    let waitingScheduleInterviewStatus: string[] = [];
    let scheduledInterviewStatus: string[] = [];
    let waitingInterviewFeedbackStatus: string[] = [];
    let finalVoteStatus: string[] = [];

    for (let i = 0; i < this.participants.length; i++) {
      switch (this.participantsStatus[i]) {
        case "Waiting for form feedback":
          waitingFormUsers.push(this.participants[i]);
          waitingFormStatus.push(this.participantsStatus[i]);
          break;
        case "Passed form stage":
          passedFormUsers.push(this.participants[i]);
          passedFormStatus.push(this.participantsStatus[i]);
          break;
        case "Rejected at form stage":
          rejectedFormUsers.push(this.participants[i]);
          rejectedFormStatus.push(this.participantsStatus[i]);
          break;
        case "Passed workshop stage":
          passedWorkshopUsers.push(this.participants[i]);
          passedWorkshopStatus.push(this.participantsStatus[i]);
          break;
        case "Rejected at workshop stage":
          rejectedWorkshopUsers.push(this.participants[i]);
          rejectedWorkshopStatus.push(this.participantsStatus[i]);
          break;
        case "Scheduled for workshop":
          scheduledWorkshopUsers.push(this.participants[i]);
          scheduledWorkshopStatus.push(this.participantsStatus[i]);
          break;
        case "Waiting for workshop feedback":
          waitingWorkshopFeedbackUsers.push(this.participants[i]);
          waitingWorkshopFeedbackStatus.push(this.participantsStatus[i]);
          break;
        case "Not scheduled for workshop":
          waitingScheduleWorkshopUsers.push(this.participants[i]);
          waitingScheduleWorkshopStatus.push(this.participantsStatus[i]);
          break;
        case "Not scheduled for interview":
          waitingScheduleInterviewUsers.push(this.participants[i]);
          waitingScheduleInterviewStatus.push(this.participantsStatus[i]);
          break;
        case "Scheduled for interview":
          scheduledInterviewUsers.push(this.participants[i]);
          scheduledInterviewStatus.push(this.participantsStatus[i]);
          break;
        case "Waiting for interview feedback":
          waitingInterviewFeedbackUsers.push(this.participants[i]);
          waitingInterviewFeedbackStatus.push(this.participantsStatus[i]);
          break;
        case "Ready for final vote":
          finalVoteUsers.push(this.participants[i]);
          finalVoteStatus.push(this.participantsStatus[i]);
          break;
      }
    }

    this.participants = [
      ...waitingFormUsers,
      ...waitingScheduleWorkshopUsers,
      ...waitingScheduleInterviewUsers,

      ...waitingWorkshopFeedbackUsers,
      ...waitingInterviewFeedbackUsers,

      ...finalVoteUsers,

      ...scheduledInterviewUsers,
      ...scheduledWorkshopUsers,

      ...passedWorkshopUsers,
      ...passedFormUsers,

      ...rejectedWorkshopUsers,
      ...rejectedFormUsers,
    ];
    this.participantsStatus = [
      ...waitingFormStatus,
      ...waitingScheduleWorkshopStatus,
      ...waitingScheduleInterviewStatus,

      ...waitingWorkshopFeedbackStatus,
      ...waitingInterviewFeedbackStatus,

      ...finalVoteStatus,

      ...scheduledInterviewStatus,
      ...scheduledWorkshopStatus,

      ...passedWorkshopStatus,
      ...passedFormStatus,

      ...rejectedWorkshopStatus,
      ...rejectedFormStatus,
    ];
  }

  giveFormFeedback(status: string, participantId: string) {
    let formFeedback: FormFeedbackPost = {
      candidateId: participantId,
      feedbackGiverId: this.currentUser.id,
      formId: this.currentForm.id,
      status: status == "pass" ? "PassedForm" : "RejectedForm",
    };
    Swal.fire({
      title: `Are you sure?`,
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
    }).then((res) => {
      if (res.value)
        this.participantsService
          .addParticipantFordFeedback(formFeedback)
          .subscribe(
            async (res) => {
              Swal.fire({
                title: "Feedback saved successfully",
                icon: "success",
              });
              let participantsDto = await this.participantsService
                .getSessionParticipants(this.currentSession.id)
                .toPromise();
              this.getParticipantsStatus(participantsDto);
              this.orderParticipantsByWaitingStatus();
            },
            (err) => {
              Swal.fire({
                title: "There was an error with your request",
                icon: "error",
              });
            }
          );
    });
  }

  async changeDisplay(display: string) {
    if (display == "candidates") {
      let participantsDto = await this.participantsService
        .getSessionParticipants(this.currentSession.id)
        .toPromise();
      this.getParticipantsStatus(participantsDto);
      this.orderParticipantsByWaitingStatus();
    }
    this.whatToDisplay = display;
  }

  shouldShowActions() {
    if (this.creator.id === this.currentUser.id) return true;
    return false;
  }

  startDateErrors() {
    let currentDate = new Date().setHours(0, 0, 0, 0);
    let startDate = new Date(this.currentSession.startDate).getTime();
    let endDate = new Date(this.currentSession.endDate).getTime();

    if (endDate < startDate) {
      this.invalidSession = true;
      return "End date can't be earlier than start date!";
    }

    if (startDate < currentDate) {
      this.invalidSession = true;
      return "Start date can't be earlier than today!";
    }

    this.invalidSession = false;
    return null;
  }

  endDateErrors() {
    let startDate = new Date(this.currentSession.startDate).getTime();
    let endDate = new Date(this.currentSession.endDate).getTime();

    if (endDate < startDate) {
      this.invalidSession = true;
      return "End date can't be earlier than start date!";
    }

    this.invalidSession = false;
    return null;
  }

  edit() {
    Swal.fire({
      title: "Are you sure you want to edit this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) this.editingSession = true;
    });
  }

  editForm() {
    this.editingForm = true;
  }

  saveFormChanges() {
    this.editingForm = false;
  }

  updateFormInfo(newFormInfo: FormInfo) {
    let updatedForm: FormInfo = {
      id: this.currentForm.id,
      title: newFormInfo.title,
      description: newFormInfo.description,
      questions: newFormInfo.questions,
      startDate: newFormInfo.startDate,
      endDate: newFormInfo.endDate,
    };
    this.sessionService
      .updateForm(this.mapperService.mapFormInfoToDto(updatedForm))
      .subscribe(
        (res) => {
          Swal.fire({ title: "Form updated succesfully!", icon: "success" });
          this.editingForm = false;
          this.currentForm = updatedForm;
        },
        (err) => {
          Swal.fire({
            title: "Sorry something went wrong!\nPlease try again later.",
            icon: "error",
          });
        }
      );
  }

  async stopEditing() {
    await Swal.fire({
      title: "Finished editing?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) this.editingSession = false;
      this.currentSession.startDate = new Date(
        new Date(this.currentSession.startDate).setHours(3, 0, 0, 0)
      );
      this.currentSession.endDate = new Date(
        new Date(this.currentSession.endDate).setHours(3, 0, 0, 0)
      );
    });

    if (!this.editingSession) {
      this.sessionService.updateSessionInfo(this.currentSession).subscribe(
        (result) => {
          Swal.fire({
            title: "Session updated!",
            icon: "success",
            timer: 1000,
          });
        },
        (error) => {
          Swal.fire({
            title: "Something went wrong...",
            icon: "error",
            timer: 2000,
          });
        }
      );
    }
  }

  parseDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatus(): string {
    let castedStartDate = new Date(this.currentSession.startDate).setHours(
      0,
      0,
      0,
      0
    );
    let castedEndDate = new Date(this.currentSession.endDate).setHours(
      23,
      59,
      59,
      99
    );
    let currentDate = new Date().getTime();

    if (currentDate < castedStartDate) return "Upcoming";

    if (castedStartDate < currentDate && currentDate < castedEndDate)
      return "Active";

    if (castedEndDate < currentDate) return "Finished";
  }

  deleteSession() {
    Swal.fire({
      title: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        this.sessionService
          .deleteSession(this.currentUser, this.currentSession.id)
          .subscribe(
            (res) => {
              Swal.fire({
                title: "Session deleted!",
                icon: "success",
                timer: 1500,
              }).then(() => {
                this.router.navigate(["/sessions"]);
              });
            },
            (error) => {
              Swal.fire({ icon: "error", title: "Something went wrong..." });
            }
          );
      }
    });
  }

  getCurrentFormStatus(): string {
    if (new Date() < new Date(this.currentForm.startDate)) return "NotStarted";
    if (
      new Date(this.currentForm.startDate) < new Date() &&
      new Date().getTime() <
        new Date(this.currentForm.endDate).setHours(23, 59, 59)
    )
      return "Active";
    if (new Date(this.currentForm.endDate) < new Date()) return "Ended";
  }

  canGiveFormFeedback(userIndex: number): boolean {
    if (
      this.getCurrentFormStatus() == "Ended" &&
      this.participantsStatus[userIndex] == "Waiting for form feedback" &&
      this.currentUser.role == "ProjectManager"
    )
      return true;

    return false;
  }

  goToFinalVotePage() {
    let readyForFinalVote: boolean = true;
    if (this.participants.length == 0) readyForFinalVote = false;
    this.participantsStatus.forEach((status) => {
      if (
        status != "Ready for final vote" &&
        status != "Rejected at form stage" &&
        status != "Rejected at workshop stage"
      )
        readyForFinalVote = false;
    });

    if (!readyForFinalVote) {
      Swal.fire({
        title: "Not everybody is ready for final vote!",
        text: "Please check the participants! \nThere might be missing feedbacks or not everybody was rejected!",
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
      return;
    } else {
      this.router.navigate(["final-vote", this.currentSession.id]);
    }
  }

  async volunteerGoToFinalVotePage() {
    if (
      this.currentUserVoter === null ||
      this.currentUserVoter === undefined ||
      this.currentUserVoter.status == "WaitingApproval"
    ) {
      this.currentUserVoter = await this.sessionService
        .getVoter(this.currentSession.id, this.currentUser.id)
        .toPromise();
    }
    if (this.currentUserVoter.status != "Approved")
      Swal.fire({
        title: "Please wait for approval!",
        icon: "error",
        showConfirmButton: false,
        timer: 3000,
      });
    else this.router.navigate(["final-vote", this.currentSession.id]);
  }

  requestAccessToFinalVotePage() {
    let newVoter: VoterPostDto = {
      sessionId: this.currentSession.id,
      volunteerId: this.currentUser.id,
      status: "WaitingApproval",
    };

    this.sessionService.requestFinalVoteParticipation(newVoter).subscribe(
      (_res) => {
        Swal.fire({
          title: "Your request has been sent!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then((res) => {
          this.participatesInFinalVote = true;
        });
      },
      (err) => {
        Swal.fire({
          title: "We couldn't add your request...\nPlease try again later",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }
}
