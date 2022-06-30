import { getTreeNoValidDataSourceError } from "@angular/cdk/tree";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormFeedbackPost } from "src/shared/dto/feedback/send-form-feedback";
import { FormDto } from "src/shared/dto/form-dto";
import { InterviewDto } from "src/shared/dto/interview/interviewDto";
import { ParticipantsDto } from "src/shared/dto/participant-dto";
import { QuestionAnswer } from "src/shared/interfaces/form/answers/questionAnswer";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { InterviewFeedback } from "src/shared/interfaces/interview/interview-feedback";
import { InterviewInfo } from "src/shared/interfaces/interview/interview-info";
import { InterviewParticipantsInfo } from "src/shared/interfaces/interview/interview-participants-info";
import { InterviewSchedule } from "src/shared/interfaces/interview/interview-schedule";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { WorkshopFeedback } from "src/shared/interfaces/workshop/workshop-feedback";
import { WorkshopInfo } from "src/shared/interfaces/workshop/workshop-info";
import { WorkshopSchedule } from "src/shared/interfaces/workshop/workshop-schedule";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { ParticipantsService } from "src/shared/services/participants.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  currentUser: UserInfo;

  profileUser: UserInfo;
  profileUserId: string;
  profileUserStatus: string;

  profileUserWorkshopSchedule: WorkshopInfo;
  profileUserWorkshopFeedback: WorkshopFeedback;

  profileUserInterviewSchedule: InterviewInfo;
  profileUserInterviewParticipants: InterviewParticipantsInfo;
  profileUserInterviewFeedback: InterviewFeedback;

  displayFormAnswers: boolean;

  availableWorkshopsDisplay: string[];
  availableWorkshops: WorkshopInfo[];
  participantsWorkshop: UserInfo[];
  selectedWorkshop: WorkshopInfo;
  selectedWorkshopIndex: number;

  availableInterviewsDates: Date[];
  availableInterviews: Map<Date, InterviewInfo[]>;
  availableInterviewsParticipants: Map<number, InterviewParticipantsInfo>;

  selectedInterviewIndex: number;
  selectedDateIndex: number;
  selectedInterview: InterviewInfo;
  selectedInterviewParticipants: InterviewParticipantsInfo;

  activeSession: SessionInfo;
  activeForm: FormInfo;
  userAnswers: Array<string>;
  missingForm: boolean;

  display: string;

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private dtoMapper: DtoMapperService,
    private sessionService: SessionService,
    private authService: AuthenticationService,
    private participantsService: ParticipantsService
  ) {}

  async getProfileUser() {
    let participantDto: ParticipantsDto = await this.participantsService
      .getParticipant(this.profileUserId)
      .toPromise();
    this.profileUser = participantDto.user;
    this.profileUserStatus = participantDto.status;
  }

  getProfileUserInterview(allInterviews: InterviewDto[]) {
    allInterviews.forEach((intDto) => {
      intDto.interviewsScheduledUsers.forEach((participants, index) => {
        if (participants.participant != null) {
          if (participants.participant.id == this.profileUser.id) {
            intDto.interviewsDetails[index].interviewDateTime = new Date(
              intDto.interviewsDetails[index].interviewDateTime
            );
            this.profileUserInterviewSchedule = intDto.interviewsDetails[index];
            this.profileUserInterviewParticipants =
              intDto.interviewsScheduledUsers[index];
          }
        }
      });
    });
  }

  async ngOnInit() {
    this.display = "UserInfo";
    this.displayFormAnswers = false;
    this.profileUserId = this.route.snapshot.paramMap.get("id");
    this.selectedWorkshopIndex = 0;

    await this.getProfileUser();
    this.currentUser = await this.authService.getCurrentUser().toPromise();

    this.activeSession = await this.sessionService
      .getActiveSession()
      .toPromise();

    let activeFormDto: FormDto = await this.sessionService
      .getSessionForm(this.activeSession.id)
      .toPromise();

    if (activeFormDto == null) {
      this.missingForm = true;
    } else {
      this.activeForm = this.dtoMapper.mapFormDtoToFormInfo(activeFormDto);
      await this.participantsService
        .getParticipantAnswer(this.profileUser.id, this.activeForm.id)
        .subscribe((res) => {
          if (res.length == 0) this.displayFormAnswers = false;
          else {
            this.displayFormAnswers = true;
            let questionAnswer: Array<QuestionAnswer> = res;
            this.userAnswers = Array(this.activeForm.questions.length).fill("");

            questionAnswer.forEach((qa) => {
              let foundPlace: boolean;
              let questionIndex: number = 0;
              while (!foundPlace) {
                if (
                  this.activeForm.questions[questionIndex].question.getId() ==
                  qa.questionId
                ) {
                  foundPlace = true;
                  this.userAnswers[
                    this.activeForm.questions[questionIndex].position
                  ] = qa.answer;
                }
                questionIndex++;
              }
            });
          }
        });
    }

    if (this.profileUserStatus == "Not scheduled for workshop") {
      this.participantsWorkshop = [];
      this.availableWorkshops = [];
      this.availableWorkshopsDisplay = ["Select workshop"];
      let allWorkshops = await this.sessionService
        .getSessionWorkshops(this.activeSession.id)
        .toPromise();
      allWorkshops.forEach(async (ws) => {
        let wsParticipants = await this.sessionService
          .getWorkshopParticipants(ws.id)
          .toPromise();
        if (wsParticipants.length < ws.numberOfParticipants) {
          ws.workshopDate = new Date(ws.workshopDate);
          this.availableWorkshops.push(ws);
          this.availableWorkshopsDisplay.push(
            `${ws.workshopDate.toLocaleString()}, ${ws.departments
              .split(";;")
              .join(", ")}`
          );
        }
      });
    }

    if (this.profileUserStatus == "Not scheduled for interview") {
      this.selectedDateIndex = 0;
      this.availableInterviews = new Map<Date, InterviewInfo[]>();
      this.availableInterviewsParticipants = new Map<
        number,
        InterviewParticipantsInfo
      >();
      let allInterviews: InterviewDto[] = await this.sessionService
        .getInterviewsBySessionId(this.activeSession.id)
        .toPromise();
      allInterviews.forEach((interviewDto) => {
        let commonDate: Date = new Date(interviewDto.interviewsDate);
        interviewDto.interviewsDetails.forEach((interviewInfo, index) => {
          interviewInfo.interviewDateTime = new Date(
            interviewInfo.interviewDateTime
          );
          if (
            interviewDto.interviewsScheduledUsers[index].participant == null
          ) {
            this.availableInterviewsParticipants.set(
              interviewInfo.id,
              interviewDto.interviewsScheduledUsers[index]
            );
            if (this.availableInterviews.get(commonDate))
              this.availableInterviews.get(commonDate).push(interviewInfo);
            else {
              let newList: InterviewInfo[] = [];
              newList.push(interviewInfo);
              this.availableInterviews.set(commonDate, newList);
            }
          }
        });
      });
      this.availableInterviewsDates = Array.from(
        this.availableInterviews.keys()
      );
    }

    if (
      this.profileUserStatus != "Not scheduled for workshop" &&
      this.profileUserStatus != "Passed form stage" &&
      this.profileUserStatus != "Rejected at form stage" &&
      this.profileUserStatus != "Waiting for form feedback"
    ) {
      this.profileUserWorkshopSchedule = await this.participantsService
        .getParticipantWorkshop(this.profileUserId, this.activeSession.id)
        .toPromise();
      this.profileUserWorkshopSchedule.workshopDate = new Date(
        this.profileUserWorkshopSchedule.workshopDate
      );
      if (this.profileUserStatus != "Scheduled for workshop") {
        this.profileUserWorkshopFeedback = await this.sessionService
          .getWorkshopFeedback(
            this.profileUserId,
            this.profileUserWorkshopSchedule.id
          )
          .toPromise();
        if (
          this.profileUserStatus != "Not scheduled for interview" &&
          this.profileUserStatus != "Rejected at workshop stage"
        ) {
          let allInterviews: InterviewDto[] = await this.sessionService
            .getInterviewsBySessionId(this.activeSession.id)
            .toPromise();
          this.getProfileUserInterview(allInterviews);
          if (this.profileUserStatus == "Ready for final vote") {
            allInterviews.forEach((intDto) => {
              intDto.interviewsFeedbacks.forEach((feedback) => {
                if (
                  feedback.interviewId == this.profileUserInterviewSchedule.id
                )
                  this.profileUserInterviewFeedback = feedback;
              });
            });
          }
        }
      }
    }
  }

  updateSelectedWS() {
    if (this.selectedWorkshopIndex == 0) this.selectedWorkshop == null;
    else
      this.selectedWorkshop =
        this.availableWorkshops[this.selectedWorkshopIndex - 1];
  }

  updateSelectedInterview() {
    this.selectedInterview = this.availableInterviews.get(
      this.availableInterviewsDates[this.selectedDateIndex]
    )[this.selectedInterviewIndex];
    this.selectedInterviewParticipants =
      this.availableInterviewsParticipants.get(this.selectedInterview.id);
  }

  canSeeForm() {
    return new Date(this.activeForm.startDate) < new Date();
  }

  editedUser: UserInfo;
  changeInfo(editUserInfoModal) {
    this.editedUser = this.profileUser;
    Swal.fire({
      title: "Do you want to edit your info?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "No",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
    }).then((res) => {
      if (res.value)
        this.modalService.open(editUserInfoModal, {
          centered: true,
          size: "lg",
        });
    });
  }

  changePassword() {
    Swal.fire({
      title: "Do you want to change your password?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "No",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
    });
  }

  changeDisplay(newDisplay: string) {
    this.display = newDisplay;
  }

  approveParticipantForm() {
    let formFeedback: FormFeedbackPost = {
      formId: this.activeForm.id,
      candidateId: this.profileUser.id,
      feedbackGiverId: this.currentUser.id,
      status: "PassedForm",
    };
    Swal.fire({
      title: "Are you sure you?",
      text: "Once submitted you can't change the vote!",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.participantsService
          .addParticipantFordFeedback(formFeedback)
          .subscribe(
            (_) => {
              Swal.fire({
                title: "Feedback saved successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              }).then(async (_) => {
                await this.ngOnInit();
                this.changeDisplay("FormInfo");
              });
            },
            (err) => {
              Swal.fire({
                title: "There was an error...\nPlease try again later",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          );
    });
  }

  rejectParticipantForm() {
    let formFeedback: FormFeedbackPost = {
      formId: this.activeForm.id,
      candidateId: this.profileUser.id,
      feedbackGiverId: this.currentUser.id,
      status: "RejectedForm",
    };

    Swal.fire({
      title: "Are you sure you?",
      text: "Once submitted you can't change the vote!",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.participantsService
          .addParticipantFordFeedback(formFeedback)
          .subscribe(
            (_) => {
              Swal.fire({
                title: "Feedback saved successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              }).then(async (_) => {
                this.changeDisplay("FormInfo");
              });
            },
            (err) => {
              Swal.fire({
                title: "There was an error...\nPlease try again later",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
              });
            }
          );
    });
  }

  scheduleUserWorkshop() {
    let workshopSchedule: WorkshopSchedule = {
      participantId: this.profileUserId,
      volunteerId: this.currentUser.id,
      workshopId: this.selectedWorkshop.id,
      type: "Participant",
    };
    Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService.postWorkshopSchedule(workshopSchedule).subscribe(
          (_res) => {
            Swal.fire({
              title: "Schedule made successfully!",
              icon: "success",
              timer: 1500,
            }).then(async (res) => {
              await this.ngOnInit();
              this.changeDisplay("WorkshopInterview");
            });
          },
          (_err) => {
            Swal.fire({
              title: "Something went wrong...\nPlease try again later!",
              icon: "error",
              timer: 1500,
            });
          }
        );
    });
  }

  scheduleUserInterview() {
    let interviewSchedule: InterviewSchedule = {
      interviewId: this.selectedInterview.id,
      participantId: this.profileUser.id,
      volunteerId: this.currentUser.id,
      type: "Participant",
    };

    Swal.fire({
      title: "Are you sure?",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .createInterviewSchedule(interviewSchedule)
          .subscribe(
            (res) => {
              Swal.fire({
                title: "Interview scheduled successfully!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              }).then(async (_) => {
                await this.ngOnInit();
                this.display = "WorkshopInterview";
              });
            },
            (err) => {
              Swal.fire({
                title: "Interview schedule failed...\nPlease try again later!",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          );
    });
  }

  openModal(templateRef) {
    this.modalService.open(templateRef, { centered: true, size: "lg" });
  }

  saveProfileChanges() {
    this.authService.updateUser(this.profileUser).subscribe((res) => {
      this.profileUser = res;
      Swal.fire({
        title: "Changes saved successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    });
  }
}
