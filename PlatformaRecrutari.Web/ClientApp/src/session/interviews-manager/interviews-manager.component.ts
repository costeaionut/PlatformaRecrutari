import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { InterviewDto } from "src/shared/dto/interview/interviewDto";
import { InterviewFeedback } from "src/shared/interfaces/interview/interview-feedback";
import { InterviewInfo } from "src/shared/interfaces/interview/interview-info";
import { InterviewParticipantsInfo } from "src/shared/interfaces/interview/interview-participants-info";
import { InterviewSchedule } from "src/shared/interfaces/interview/interview-schedule";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-interviews-manager",
  templateUrl: "./interviews-manager.component.html",
  styleUrls: ["./interviews-manager.component.css"],
})
export class InterviewsManagerComponent implements OnInit {
  @Input() session: SessionInfo;
  @Input() currentUser: UserInfo;

  interviewsParticipants: Map<number, InterviewParticipantsInfo>;
  interviewsFeedbacks: Map<number, InterviewFeedback>;
  interviews: Map<Date, Array<InterviewInfo>>;
  interviewsDates: Date[];

  selectedDate: Date;
  selectedDateIndex: number;
  selectedDateString: string;

  eligibleUsers: UserInfo[];

  constructor(
    private modalService: NgbModal,
    private sessionService: SessionService
  ) {}

  async getSessionInterviews() {
    this.interviews = new Map<Date, Array<InterviewInfo>>();
    this.interviewsFeedbacks = new Map<number, InterviewFeedback>();
    this.interviewsParticipants = new Map<number, InterviewParticipantsInfo>();

    let interviewsDto: Array<InterviewDto> = await this.sessionService
      .getInterviewsBySessionId(this.session.id)
      .toPromise();

    interviewsDto.forEach((intDto) => {
      intDto.interviewsDetails.forEach((interviewDetail, interviewIndex) => {
        interviewDetail.interviewDateTime = new Date(
          interviewDetail.interviewDateTime
        );
        this.interviewsParticipants.set(
          interviewDetail.id,
          intDto.interviewsScheduledUsers[interviewIndex]
        );
        this.interviewsFeedbacks.set(
          interviewDetail.id,
          intDto.interviewsFeedbacks[interviewIndex]
        );
      });
      this.interviews.set(
        new Date(intDto.interviewsDate),
        intDto.interviewsDetails
      );
    });
    this.interviewsDates = Array.from(this.interviews.keys());

    if (this.selectedDateIndex === undefined) this.selectedDateIndex = 0;
    this.selectedDate = this.interviewsDates[this.selectedDateIndex];
    this.selectedDateString = this.selectedDate.toLocaleDateString();
  }

  async getEligibleUsers() {
    this.eligibleUsers = await this.sessionService
      .getInterviewEligibleUsers(this.session.id)
      .toPromise();
  }

  async ngOnInit() {
    await this.getEligibleUsers();
    await this.getSessionInterviews();
    console.log(this.eligibleUsers);
  }

  changeDisplayCreate(newDisplay: string) {
    this.whatToDisplayCreate = newDisplay;
  }

  /**
   * Variables for single interview create
   */
  newInterviewDate: Date;
  whatToDisplayCreate: string;
  newInterviewDuration: number;
  displayInterviewDateTime: string;
  newInterviewBreakDuration: number;
  newSingleIntreviewErrors: string[];

  openCreateInterviewModal(content) {
    this.newInterviewDuration = 40;
    this.whatToDisplayCreate = "Single";
    this.newInterviewBreakDuration = 15;
    this.multipleInterviewDuration = 40;
    this.multipleInterviewBreakDuration = 15;

    this.newInterviewDate = undefined;
    this.displayInterviewDateTime = "";

    this.multipleInterviewEndDate = undefined;
    this.multipleInterviewStartDate = undefined;

    this.displyMultipleInterviewStartDate = "";
    this.displyMultipleInterviewEndDate = "";

    this.modalService.open(content, { centered: true, size: "lg" });
  }

  updateDateDisplay() {
    this.displayInterviewDateTime = `${this.newInterviewDate.toLocaleString()}`;
  }

  updateHour(newTime: Date) {
    this.newInterviewDate.setHours(newTime.getHours(), newTime.getMinutes());
    this.updateDateDisplay();
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  addMinutesToDate(date: Date, minutes: number): Date {
    return new Date(new Date(date).setMinutes(date.getMinutes() + minutes));
  }

  checkForErrorsSingleInterview() {
    this.newSingleIntreviewErrors = [];
    if (!this.newInterviewDate)
      this.newSingleIntreviewErrors.push(
        "Please select a date and a time for the interview!"
      );
    if (this.newInterviewDate < new Date())
      this.newSingleIntreviewErrors.push(
        "Date and time can't be smaller than today!"
      );
  }

  createNewSingleInterview(createInterviewModal) {
    this.checkForErrorsSingleInterview();
    if (this.newSingleIntreviewErrors.length != 0) return;

    let newInterview: InterviewInfo = {
      id: 0,
      sessionId: this.session.id,
      interviewDateTime: this.addHoursToDate(this.newInterviewDate, 3),
      duration: parseInt(this.newInterviewDuration.toString()),
      break: parseInt(this.newInterviewBreakDuration.toString()),
    };

    this.sessionService.postInterview(newInterview).subscribe(
      (_) => {
        Swal.fire({
          title: "Interview created successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(async (_) => {
          await this.ngOnInit();
          createInterviewModal.close();
        });
      },
      (err) => {
        switch (err.error) {
          case "InterviewsOverlapping":
            Swal.fire({
              title:
                "Interviews are overlapping...\nPlease check existing interviews",
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
            });
            break;
        }
      }
    );
  }

  /**
   * Variables for multiple interview create
   */
  multipleInterviewEndDate: Date;
  multipleInterviewStartDate: Date;
  displyMultipleInterviewEndDate: string;
  displyMultipleInterviewStartDate: string;
  multipleInterviewDuration: number;
  multipleInterviewBreakDuration: number;
  multipleInterviewErrors: string[];

  updateStartDateDisplay() {
    this.displyMultipleInterviewStartDate = `${this.multipleInterviewStartDate.toLocaleString()}`;
  }

  updateStartHour(newTime: Date) {
    this.multipleInterviewStartDate.setHours(
      newTime.getHours(),
      newTime.getMinutes()
    );
    this.updateStartDateDisplay();
  }

  updateEndDateDisplay() {
    this.displyMultipleInterviewEndDate = `${this.multipleInterviewEndDate.toLocaleString()}`;
  }

  updateEndHour(newTime: Date) {
    this.multipleInterviewEndDate.setHours(
      newTime.getHours(),
      newTime.getMinutes()
    );
    this.updateEndDateDisplay();
  }

  checkForErrorsMultipleInterviews() {
    if (!this.multipleInterviewEndDate || !this.multipleInterviewStartDate)
      this.multipleInterviewErrors.push(
        "Please select a start date and an end date for generation"
      );
    if (this.multipleInterviewStartDate < new Date())
      this.multipleInterviewErrors.push(
        "Start date can't be set to earlier than now!"
      );

    if (this.multipleInterviewEndDate < this.multipleInterviewStartDate)
      this.multipleInterviewErrors.push(
        "Start date must be higher than end date!"
      );
  }

  generatedMultiplInterviews: InterviewInfo[];
  generateMultipleInterviews(reviewGeneratedModal) {
    this.multipleInterviewErrors = [];
    this.checkForErrorsMultipleInterviews();

    if (this.multipleInterviewErrors.length != 0) return;

    let startDate: Date = this.multipleInterviewStartDate;
    let endDate: Date = this.multipleInterviewEndDate;

    let localBreakTime: number = parseInt(
      this.multipleInterviewBreakDuration.toString()
    );
    let localDurationTime: number = parseInt(
      this.multipleInterviewDuration.toString()
    );

    let interviews: InterviewInfo[] = [];

    for (
      let curDate = startDate;
      curDate < endDate;
      curDate = this.addMinutesToDate(
        curDate,
        localBreakTime + localDurationTime
      )
    ) {
      let newInterview: InterviewInfo = {
        id: 0,
        break: localBreakTime,
        interviewDateTime: curDate,
        sessionId: this.session.id,
        duration: localDurationTime,
      };

      if (
        this.addMinutesToDate(
          newInterview.interviewDateTime,
          newInterview.break + newInterview.duration
        ) <= endDate
      ) {
        interviews.push(newInterview);
      }
    }
    this.generatedMultiplInterviews = interviews;
    this.modalService.open(reviewGeneratedModal, {
      centered: true,
      size: "lg",
      scrollable: true,
    });
  }

  createMultipleInterviews() {
    this.generatedMultiplInterviews.forEach((interview) => {
      interview.interviewDateTime = this.addHoursToDate(
        interview.interviewDateTime,
        3
      );
    });

    this.sessionService
      .postInterviewRange(this.generatedMultiplInterviews)
      .subscribe(
        (_) => {
          Swal.fire({
            title: "Interview created successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(async (_) => {
            await this.ngOnInit();
            this.modalService.dismissAll();
          });
        },
        (err) => {
          switch (err.error) {
            case "InterviewsOverlapping":
              Swal.fire({
                title:
                  "Interviews are overlapping...\nPlease check existing interviews",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              }).then((_) => {
                this.generatedMultiplInterviews.forEach((interview) => {
                  interview.interviewDateTime = this.addHoursToDate(
                    interview.interviewDateTime,
                    -3
                  );
                });
              });
              break;
          }
        }
      );
  }

  updatedSelectedDateDisplay() {
    this.selectedDate = this.interviewsDates[this.selectedDateIndex];
    this.selectedDateString = this.selectedDate.toLocaleDateString();
  }

  changePage(step: number) {
    this.selectedDateIndex += step;
    this.updatedSelectedDateDisplay();
  }

  displayInterview: InterviewInfo;
  displayInterviewParticipants: InterviewParticipantsInfo;
  openInterviewInfoModal(displayInterviewModal, interview: InterviewInfo) {
    this.displayInterview = interview;
    this.displayInterviewParticipants = this.interviewsParticipants.get(
      interview.id
    );

    this.modalService.open(displayInterviewModal, {
      centered: true,
      size: "lg",
    });
  }

  deleteOpenedInterview() {
    Swal.fire({
      title: "Are you sure you want to delete the interview?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "green",
      confirmButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService.deleteInterview(this.displayInterview).subscribe(
          (_) => {
            Swal.fire({
              title: "Workshop deleted successfully!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(async (res) => {
              await this.getSessionInterviews();

              try {
                this.selectedDate =
                  this.interviewsDates[this.selectedDateIndex];
              } catch (error) {
                try {
                  this.selectedDate =
                    this.interviewsDates[this.selectedDateIndex - 1];
                  this.selectedDateIndex -= 1;
                } catch (error) {
                  this.selectedDate =
                    this.interviewsDates[this.selectedDateIndex + 1];
                  this.selectedDateIndex += 1;
                }
              }
              this.modalService.dismissAll();
              this.displayInterview = undefined;
            });
          },
          (err) => {
            Swal.fire({
              title:
                "There was an error deleting this interview...\nPlease try again",
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
    });
  }
  canDeleteDisplayInterview() {
    return (
      this.currentUser.id == this.session.creatorId &&
      this.currentUser.role == "ProjectManager" &&
      this.displayInterview.interviewDateTime > new Date()
    );
  }

  scheduleMyself(interview: InterviewInfo) {
    let displayRole = "";
    let role = "";
    switch (this.currentUser.role) {
      case "Volunteer":
        displayRole = "volunteer";
        role = "Volunteer";
        break;

      case "DepartmentDirector":
        displayRole = "department director";
        role = "DD";
        break;

      case "BoardMember":
        displayRole = "board member";
        role = "CD";
        break;
      default:
        break;
    }

    Swal.fire({
      title: `Are you sure you want to participate as a ${displayRole}`,
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "green",
      confirmButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value) {
        let newInterviewSchedule: InterviewSchedule = {
          interviewId: interview.id,
          participantId: this.currentUser.id,
          volunteerId: this.currentUser.id,
          type: role,
        };
        this.sessionService
          .createInterviewSchedule(newInterviewSchedule)
          .subscribe(
            async (_res) => {
              Swal.fire({
                title: "You are now participating at this interview!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
              await this.getSessionInterviews();
            },
            (_err) => {
              if (_err.error == "InterviewAlreadyTaken")
                Swal.fire({
                  title: "Interview slot is already booked!",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 2500,
                }).then(async (_) => {
                  await this.getSessionInterviews();
                });
              else
                Swal.fire({
                  title: "Sorry there was an error...\nPlease try again later!",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 1500,
                });
            }
          );
      }
    });
  }

  canSchedule(interview: InterviewInfo) {
    if (
      (this.currentUser.role == "Volunteer" ||
        (this.currentUser.role == "ProjectManager" &&
          this.currentUser.id == this.session.creatorId)) &&
      interview.interviewDateTime > new Date()
    )
      if (this.interviewsParticipants.get(interview.id).participant == null)
        return true;
    return false;
  }
  canScheduleMyself(interview: InterviewInfo) {
    if (
      (this.currentUser.role == "Volunteer" ||
        this.currentUser.role == "DepartmentDirector" ||
        this.currentUser.role == "BoardMember") &&
      interview.interviewDateTime > new Date()
    ) {
      switch (this.currentUser.role) {
        case "Volunteer":
          if (this.interviewsParticipants.get(interview.id).hr == null)
            return true;
          break;
        case "DepartmentDirector":
          if (this.interviewsParticipants.get(interview.id).dd == null)
            return true;
          break;
        case "BoardMember":
          if (this.interviewsParticipants.get(interview.id).cd == null)
            return true;
          break;
      }
    }
    return false;
  }
  canCancelMySchedule(interview: InterviewInfo) {
    if (
      (this.currentUser.role == "Volunteer" ||
        this.currentUser.role == "DepartmentDirector" ||
        this.currentUser.role == "BoardMember") &&
      interview.interviewDateTime > new Date()
    ) {
      switch (this.currentUser.role) {
        case "Volunteer":
          if (this.interviewsParticipants.get(interview.id).hr != null)
            if (
              this.interviewsParticipants.get(interview.id).hr.id ==
              this.currentUser.id
            )
              return true;
          break;
        case "DepartmentDirector":
          if (this.interviewsParticipants.get(interview.id).dd != null)
            if (
              this.interviewsParticipants.get(interview.id).dd.id ==
              this.currentUser.id
            )
              return true;
          break;
        case "BoardMember":
          if (this.interviewsParticipants.get(interview.id).cd != null)
            if (
              this.interviewsParticipants.get(interview.id).cd.id ==
              this.currentUser.id
            )
              return true;
          break;
      }
    }
    return false;
  }
  cancelMySchedule(interview: InterviewInfo) {
    let role = "";
    switch (this.currentUser.role) {
      case "Volunteer":
        role = "Volunteer";
        break;

      case "DepartmentDirector":
        role = "DD";
        break;

      case "BoardMember":
        role = "CD";
        break;
      default:
        break;
    }

    let interviewSchedule: InterviewSchedule = {
      interviewId: interview.id,
      participantId: this.currentUser.id,
      volunteerId: this.currentUser.id,
      type: role,
    };

    Swal.fire({
      title: "Are you sure you don't want to participate anymore?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "green",
      confirmButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .deleteInterviewSchedule(interviewSchedule)
          .subscribe(
            async (_) => {
              Swal.fire({
                title: "You are not assigned anymore!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });
              await this.getSessionInterviews();
            },
            (err) => {
              Swal.fire({
                title:
                  "There was an error with your request!\nPlease try again later",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          );
    });
  }
  isInterviewFinished(interview: InterviewInfo) {
    if (interview.interviewDateTime < new Date()) return true;
    return false;
  }

  userCanGiveFeedback() {
    var displayInterviewParticipants = this.interviewsParticipants.get(
      this.displayInterview.id
    );

    if (displayInterviewParticipants.participant == null) return false;

    switch (this.currentUser.role) {
      case "Volunteer":
        if (this.displayInterviewParticipants.hr.id == this.currentUser.id)
          return true;
        break;
      case "BoardMember":
        if (this.displayInterviewParticipants.cd.id == this.currentUser.id)
          return true;
        break;
      case "DepartmentDirector":
        if (this.displayInterviewParticipants.dd.id == this.currentUser.id)
          return true;
        break;
    }

    return false;
  }

  userCanViewFeedback() {
    var displayInterviewParticipants = this.interviewsParticipants.get(
      this.displayInterview.id
    );

    if (displayInterviewParticipants.participant == null) return false;
    if (this.interviewsFeedbacks.get(this.displayInterview.id) == null)
      return false;

    switch (this.currentUser.role) {
      case "Volunteer":
        if (this.displayInterviewParticipants.hr.id == this.currentUser.id)
          return true;
        break;
      case "BoardMember":
        if (this.displayInterviewParticipants.cd.id == this.currentUser.id)
          return true;
        break;
      case "DepartmentDirector":
        if (this.displayInterviewParticipants.dd.id == this.currentUser.id)
          return true;
      case "ProjectManager":
        return true;
        break;
    }

    return false;
  }

  searchedParticipant: string;
  selectedParticipant: UserInfo;
  scheduleInterview: InterviewInfo;
  filteredParticipantsToBeScheduled: UserInfo[];
  openScheduleModal(interview: InterviewInfo, scheduleParticipantModal) {
    this.scheduleInterview = interview;
    this.filteredParticipantsToBeScheduled = this.eligibleUsers;

    this.searchedParticipant = "";
    this.selectedParticipant = undefined;

    this.modalService.open(scheduleParticipantModal, {
      centered: true,
      size: "lg",
    });
  }

  updateFilteredList() {
    this.filteredParticipantsToBeScheduled = [];
    this.eligibleUsers.forEach((participant) => {
      let fullName =
        `${participant.firstName} ${participant.lastName}`.toLowerCase();
      if (fullName.includes(this.searchedParticipant.toLowerCase()))
        this.filteredParticipantsToBeScheduled.push(participant);
    });
  }
  updateSelected(user: UserInfo) {
    this.selectedParticipant = user;
    this.searchedParticipant = `${this.selectedParticipant.firstName} ${this.selectedParticipant.lastName}`;
    this.updateFilteredList();
  }
  scheduleParticipant() {
    let scheduleInterview: InterviewSchedule = {
      interviewId: this.scheduleInterview.id,
      participantId: this.selectedParticipant.id,
      volunteerId: this.currentUser.id,
      type: "Participant",
    };

    this.sessionService.createInterviewSchedule(scheduleInterview).subscribe(
      (res) => {
        Swal.fire({
          title: "Participant scheduled successfully!",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        }).then(async (_) => {
          await this.ngOnInit();
          this.modalService.dismissAll();
        });
      },
      (err) => {
        if (err.error == "InterviewAlreadyTaken")
          Swal.fire({
            title: "There was already a participant scheduled here!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          }).then(async (_) => {
            await this.ngOnInit();
            this.modalService.dismissAll();
          });
        else
          Swal.fire({
            title: "There was an error please try again later...",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          });
      }
    );
  }
  canRemoveParticipantSchedule(interview: InterviewInfo) {
    if (this.interviewsParticipants.get(interview.id).participant != null) {
      if (
        (this.currentUser.role == "ProjectManager" ||
          this.interviewsParticipants.get(interview.id).schedulerId ==
            this.currentUser.id) &&
        interview.interviewDateTime > new Date()
      ) {
        return true;
      }
    }
    return false;
  }
  removeParticipant() {
    let interviewSchedule: InterviewSchedule = {
      interviewId: this.displayInterview.id,
      participantId: this.interviewsParticipants.get(this.displayInterview.id)
        .participant.id,
      volunteerId: this.interviewsParticipants.get(this.displayInterview.id)
        .schedulerId,
      type: "Participant",
    };

    Swal.fire({
      title: "Are you sure you want to remove participant?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "green",
      confirmButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .deleteInterviewSchedule(interviewSchedule)
          .subscribe(
            (res) => {
              Swal.fire({
                title: "Participant removed successfully",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              }).then(async (res) => {
                await this.ngOnInit();
                this.modalService.dismissAll();
              });
            },
            (err) => {
              Swal.fire({
                title: "Sorry there was an error...\nPlease try again later",
                icon: "error",
                timer: 2000,
                showConfirmButton: false,
              });
            }
          );
    });
  }

  feedbackInterviewParticipants: InterviewParticipantsInfo;
  feedbackModalErrors: string[];
  candidateFeedback: string;
  CDVote: string;
  HRVote: string;
  DDVote: string;
  openInterviewFeedbackModal(templateContent) {
    this.feedbackInterviewParticipants = this.interviewsParticipants.get(
      this.displayInterview.id
    );
    this.feedbackModalErrors = [];
    this.candidateFeedback = "";
    this.HRVote = "";
    this.DDVote = "";
    this.CDVote = "";
    this.modalService.open(templateContent, { centered: true, size: "lg" });
  }

  checkForErrorsFeedbackModal() {
    if (this.candidateFeedback == "")
      this.feedbackModalErrors.push("Feedback is required!");
    if (this.HRVote == "")
      this.feedbackModalErrors.push("CD vote is required!");
    if (this.DDVote == "")
      this.feedbackModalErrors.push("CD vote is required!");
    if (this.CDVote == "")
      this.feedbackModalErrors.push("CD vote is required!");
  }

  sendFeedback() {
    this.checkForErrorsFeedbackModal();
    if (this.feedbackModalErrors.length != 0) return;

    let feedback: InterviewFeedback = {
      id: 0,
      interviewId: this.displayInterview.id,
      feedback: this.candidateFeedback,
      hrVote: this.HRVote,
      ddVote: this.DDVote,
      cdVote: this.CDVote,
    };

    Swal.fire({
      title: "Are you sure?",
      text: "Feedback cannot be changed!",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "green",
      confirmButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService.addInterviewFeedback(feedback).subscribe(
          (_res) => {
            Swal.fire({
              title: "Feedback added successfully!",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            }).then(async (_res) => {
              await this.ngOnInit();
              this.modalService.dismissAll();
            });
          },
          (err) => {
            Swal.fire({
              title: "Feedback couldn't be saved!",
              icon: "error",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        );
    });
  }
}
