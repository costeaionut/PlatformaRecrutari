import { getTreeNoValidDataSourceError } from "@angular/cdk/tree";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { FormFeedbackResponse } from "src/shared/dto/feedback/response-form-feedback";
import { FormFeedbackPost } from "src/shared/dto/feedback/send-form-feedback";
import { FormDto } from "src/shared/dto/form-dto";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
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
  currentUser: UserInfo;
  creator: UserInfo;
  whatToDisplay: string;

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
    this.participants = await this.participantsService
      .getSessionParticipants(this.currentSession.id)
      .toPromise();

    await this.getParticipantsStatus();
    this.orderParticipantsByWaitingStatus();
  }

  async getParticipantsStatus() {
    this.participantsStatus = Array(this.participants.length).fill("");

    for (let i = 0; i < this.participants.length; i++) {
      let status: FormFeedbackResponse = await this.participantsService
        .getParticipantStatus(this.participants[i].id)
        .toPromise();
      switch (status.participantStatus) {
        case "Waiting for form feedback":
          this.participantsStatus[i] = "Waiting for form feedback";
          break;
        case "PassedForm":
          this.participantsStatus[i] = "Passed form stage";
          break;
        case "RejectedForm":
          this.participantsStatus[i] = "Rejected at form stage";
          break;
        default:
          break;
      }
    }
  }

  goToUserProfile(userIndex: number) {
    let userGuid: string = this.participants[userIndex].id;
    this.router.navigate([`/user/${userGuid}`]);
  }

  orderParticipantsByWaitingStatus() {
    let waitingUsers: UserInfo[] = [];
    let passedUsers: UserInfo[] = [];
    let rejectedUsers: UserInfo[] = [];

    let waitingStatus: string[] = [];
    let passedStatus: string[] = [];
    let rejectedStatus: string[] = [];

    for (let i = 0; i < this.participants.length; i++) {
      switch (this.participantsStatus[i]) {
        case "Waiting for form feedback":
          waitingUsers.push(this.participants[i]);
          waitingStatus.push(this.participantsStatus[i]);
          break;
        case "Passed form stage":
          passedUsers.push(this.participants[i]);
          passedStatus.push(this.participantsStatus[i]);
          break;
        case "Rejected at form stage":
          rejectedUsers.push(this.participants[i]);
          rejectedStatus.push(this.participantsStatus[i]);
          break;
      }
    }

    this.participants = [...waitingUsers, ...passedUsers, ...rejectedUsers];
    this.participantsStatus = [
      ...waitingStatus,
      ...passedStatus,
      ...rejectedStatus,
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
              await this.getParticipantsStatus();
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

  changeDisplay(display: string) {
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
      this.participantsStatus[userIndex] == "Waiting for form feedback"
    )
      return true;

    return false;
  }
}
