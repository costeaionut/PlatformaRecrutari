import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { WorkshopFeedback } from "src/shared/interfaces/workshop/workshop-feedback";
import { WorkshopInfo } from "src/shared/interfaces/workshop/workshop-info";
import { WorkshopSchedule } from "src/shared/interfaces/workshop/workshop-schedule";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { SessionService } from "src/shared/services/session.service";
import Swal, { SweetAlertResult } from "sweetalert2";

@Component({
  selector: "app-workshop-manager",
  templateUrl: "./workshop-manager.component.html",
  styleUrls: ["./workshop-manager.component.css"],
})
export class WorkshopManagerComponent implements OnInit {
  @Input() session: SessionInfo;
  @Input() form: FormInfo;
  workshops: WorkshopInfo[];
  currentUser: UserInfo;

  newWorkshopDate: Date;
  disaplyDateOfNewWorkshop: string;

  departmentOptions: Map<string, boolean>;
  departments = ["Fundraising", "Educational", "HR", "PR"];
  noParticipantsList = [];

  editWorkshopId: number;
  newWorkshopNoDD: number;
  newWorkshopNoCD: number;
  newWorkshopLocation: string;
  newWorkshopDepartments: string;
  newWorkshopNoVolunteers: number;
  newWorkshopNoParticipants: number;
  newWorkshopFormErrors: string[];

  constructor(
    private modalService: NgbModal,
    private sessionService: SessionService,
    private authService: AuthenticationService
  ) {}

  async ngOnInit() {
    for (let i = 10; i <= 30; i++) this.noParticipantsList.push(i);
    this.workshops = new Array<WorkshopInfo>();
    this.workshops = await this.sessionService
      .getSessionWorkshops(this.session.id)
      .toPromise();
    this.currentUser = await this.authService.getCurrentUser().toPromise();
  }

  checkErrorsOnNewWorkshop() {
    this.newWorkshopFormErrors = [];
    if (this.newWorkshopDate == null)
      this.newWorkshopFormErrors.push("New workshop's date is required!");
    if (this.newWorkshopLocation == "")
      this.newWorkshopFormErrors.push("New workshop must have a set location!");
    if (this.newWorkshopNoDD == 0)
      this.newWorkshopFormErrors.push(
        "Please select departments for the workshop!"
      );
    if (this.newWorkshopDate < new Date())
      this.newWorkshopFormErrors.push("Date must be set later than now!");
  }

  open(content) {
    this.editWorkshopId == 0;
    this.departmentOptions = new Map<string, boolean>();
    this.departmentOptions.set("Fundraising", false);
    this.departmentOptions.set("Educational", false);
    this.departmentOptions.set("HR", false);
    this.departmentOptions.set("PR", false);

    this.newWorkshopNoCD = 1;
    this.newWorkshopNoDD = 0;
    this.newWorkshopNoVolunteers = 5;
    this.newWorkshopNoParticipants = 25;

    this.newWorkshopDate = null;
    this.newWorkshopLocation = "";
    this.newWorkshopDepartments = "";
    this.disaplyDateOfNewWorkshop = "";

    this.modalService.open(content, { centered: true, size: "lg" });
  }

  editWorkshop(content, workshop: WorkshopInfo) {
    this.editWorkshopId = workshop.id;
    this.newWorkshopNoDD = workshop.numberOfDirectors;
    this.newWorkshopNoCD = workshop.numberOfBoardMembers;
    this.newWorkshopNoVolunteers = workshop.numberOfVolunteers;
    this.newWorkshopNoParticipants = workshop.numberOfParticipants;

    this.newWorkshopLocation = workshop.location;
    this.newWorkshopDepartments = workshop.departments;
    this.newWorkshopDate = new Date(workshop.workshopDate);
    this.updateDateDisplay();

    this.departmentOptions = new Map<string, boolean>();
    this.departmentOptions.set("Fundraising", false);
    this.departmentOptions.set("Educational", false);
    this.departmentOptions.set("HR", false);
    this.departmentOptions.set("PR", false);

    for (let department of this.newWorkshopDepartments.split(";;"))
      this.departmentOptions[department] = true;

    this.modalService.open(content, { centered: true, size: "lg" });
  }

  deleteWorkshop(workshop: WorkshopInfo) {
    Swal.fire({
      title: "Are you sure you want to delete this workshop?",
      icon: "question",
      showConfirmButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
      showCancelButton: true,
      cancelButtonColor: "red",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.value)
        this.sessionService.deleteWorkshop(workshop).subscribe(
          async (res) => {
            this.workshops = await this.sessionService
              .getSessionWorkshops(this.session.id)
              .toPromise();
            Swal.fire({
              title: "Workshop deleted",
              icon: "success",
              timer: 1500,
              showLoaderOnConfirm: true,
            });
          },
          (err) => {
            Swal.fire({
              title: "Something went wrong...\nPlease try again!",
              icon: "error",
            });
          }
        );
    });
  }

  updateHour(newTime: Date) {
    this.newWorkshopDate.setHours(newTime.getHours(), newTime.getMinutes());
    this.updateDateDisplay();
  }

  updateDateDisplay() {
    this.disaplyDateOfNewWorkshop = this.newWorkshopDate.toLocaleDateString();
    this.disaplyDateOfNewWorkshop += `, ${this.newWorkshopDate.toLocaleTimeString()}`;
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  saveNewWorkshop() {
    this.checkErrorsOnNewWorkshop();
    if (this.newWorkshopFormErrors.length != 0) {
      return;
    }

    let newWorkshop: WorkshopInfo = {
      id: this.editWorkshopId,
      sessionId: this.session.id,
      location: this.newWorkshopLocation,
      numberOfDirectors: this.newWorkshopNoDD,
      departments: this.newWorkshopDepartments,
      numberOfBoardMembers: this.newWorkshopNoCD,
      numberOfVolunteers: this.newWorkshopNoVolunteers,
      numberOfParticipants: this.newWorkshopNoParticipants,
      workshopDate: this.addHoursToDate(this.newWorkshopDate, 3),
    };

    this.sessionService.postWorkshop(newWorkshop).subscribe(
      (_) => {
        Swal.fire({
          title: "Workshop created successfully",
          icon: "success",
        }).then(async (_) => {
          this.workshops = await this.sessionService
            .getSessionWorkshops(this.session.id)
            .toPromise();
          this.modalService.dismissAll();
        });
      },
      (err) => {
        Swal.fire({
          title:
            "Sorry something went wrong when creating the workshop!\nPlease try again",
          icon: "error",
        });
        console.error(err);
      }
    );
  }

  parseDateForDisplay(workshop: WorkshopInfo): string {
    let displayDate: Date = new Date(workshop.workshopDate);
    return `${displayDate.toDateString()},  ${displayDate.getHours()}:${displayDate.getMinutes()}`;
  }

  parseWorkshopStatus(workshop: WorkshopInfo): string {
    let wsDate: Date = new Date(workshop.workshopDate);
    if (new Date() < wsDate) return "Upcoming";
    if (wsDate < new Date() && new Date() < this.addHoursToDate(wsDate, 4))
      return "Active now";
    return "Finished";
  }

  parseDepartments(workshop: WorkshopInfo): string {
    let departments: string = "";

    workshop.departments.split(";;").forEach((dep) => {
      if (departments == "") departments += dep;
      else departments += `, ${dep}`;
    });

    return departments;
  }

  updateDepartments() {
    this.newWorkshopDepartments = "";
    this.newWorkshopNoDD = 0;
    this.departments.forEach((dep) => {
      if (this.departmentOptions[dep]) {
        this.newWorkshopNoDD++;
        if (this.newWorkshopDepartments == "")
          this.newWorkshopDepartments += dep;
        else this.newWorkshopDepartments += `;;${dep}`;
      }
    });
  }

  scheduleDate: Date;
  scheduleLocation: string;
  scheduleDepartments: string;
  selectedParticipant: UserInfo;

  scheduleErrors: string[];
  searchedUserName: string;
  openedWorkshopSchedule: WorkshopInfo;
  participantsToBeScheduled: Array<UserInfo>;
  filteredParticipantsToBeScheduled: Array<UserInfo>;

  canSchedule(): boolean {
    if (
      this.currentUser.role != "Participant" &&
      this.currentUser.role != "DepartmentDirector" &&
      this.currentUser.role != "BoardMember" &&
      new Date(this.form.endDate) < new Date()
    )
      return true;
    return false;
  }

  async openSchedule(content, workshop: WorkshopInfo) {
    this.scheduleErrors = [];
    this.scheduleDepartments = "";
    this.scheduleLocation = workshop.location;
    this.scheduleDate = new Date(workshop.workshopDate);
    this.openedWorkshopSchedule = workshop;
    this.selectedParticipant = undefined;
    this.searchedUserName = "";

    this.participantsToBeScheduled = new Array<UserInfo>();
    var usersForSchedulePromise = this.sessionService
      .getUsersForSchedule(workshop)
      .toPromise();

    workshop.departments.split(";;").forEach((dep) => {
      if (this.scheduleDepartments == "") this.scheduleDepartments += dep;
      else this.scheduleDepartments += `, ${dep}`;
    });

    this.participantsToBeScheduled = await usersForSchedulePromise;
    this.filteredParticipantsToBeScheduled = this.participantsToBeScheduled;

    this.modalService.open(content, { centered: true, size: "lg" });
  }

  updateFilteredList() {
    this.filteredParticipantsToBeScheduled = [];
    this.participantsToBeScheduled.forEach((participant) => {
      let fullName =
        `${participant.firstName} ${participant.lastName}`.toLowerCase();
      if (fullName.includes(this.searchedUserName.toLowerCase()))
        this.filteredParticipantsToBeScheduled.push(participant);
    });
  }

  updateSelected(selectedUser: UserInfo) {
    this.selectedParticipant = selectedUser;
    this.searchedUserName = `${this.selectedParticipant.firstName} ${this.selectedParticipant.lastName}`;
    this.updateFilteredList();
  }

  newParticipantSchedule() {
    this.scheduleErrors = [];

    if (this.selectedParticipant == undefined)
      this.scheduleErrors.push("Please select a user to schedule!");

    if (this.scheduleErrors.length != 0) return;

    let schedule: WorkshopSchedule = {
      participantId: this.selectedParticipant.id,
      workshopId: this.openedWorkshopSchedule.id,
      volunteerId: this.currentUser.id,
      type: "Participant",
    };

    Swal.fire({
      title: `Are you sure you want to schedule:\n${this.selectedParticipant.firstName} ${this.selectedParticipant.lastName}`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.value)
        this.sessionService.postWorkshopSchedule(schedule).subscribe(
          (_) => {
            Swal.fire({
              title: "Schedule made successfully!",
              icon: "success",
              timer: 1500,
            });
            this.modalService.dismissAll();
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

  wsInfoDate: Date;
  wsInfoDisplay: string;
  wsInfoLocation: string;
  wsInfoDepartments: string;
  wsInfoNoVolunteers: number;
  wsInfoOpened: WorkshopInfo;
  wsInfoNoParticipants: number;

  //An array containing the person's who scheduled the users
  wsInfoParticipantsSchedulerVolunteer: Array<UserInfo>;
  wsInfoParticipantsFeedback: Array<WorkshopFeedback>;
  wsInfoParticipants: Array<UserInfo>;
  wsInfoVolunteers: Array<UserInfo>;
  wsInfoCddd: Array<UserInfo>;
  wsInfoCd: Array<UserInfo>;
  wsInfoDd: Array<UserInfo>;

  async openWsInfo(wsInfo, workshop: WorkshopInfo) {
    this.wsInfoOpened = workshop;
    this.wsInfoDisplay = "participants";
    this.wsInfoLocation = workshop.location;
    this.wsInfoDate = new Date(workshop.workshopDate);
    this.wsInfoDepartments = workshop.departments.split(";;").join(", ");

    this.wsInfoNoVolunteers = workshop.numberOfVolunteers;
    this.wsInfoNoParticipants = workshop.numberOfParticipants;

    var promiseParticipants = this.sessionService
      .getWorkshopParticipants(workshop.id)
      .toPromise();

    var promiseVolunteers = this.sessionService
      .getWorkshopVolunteers(workshop.id)
      .toPromise();

    var promiseCDDD = this.sessionService
      .getWorkshopCDDD(workshop.id)
      .toPromise();

    this.wsInfoParticipants = await promiseParticipants;
    this.wsInfoParticipantsSchedulerVolunteer = await this.sessionService
      .getVolunteerWhoScheduledRange(this.wsInfoParticipants, this.session.id)
      .toPromise();
    this.wsInfoVolunteers = await promiseVolunteers;
    this.wsInfoCddd = await promiseCDDD;
    this.wsInfoCd = new Array<UserInfo>();
    this.wsInfoDd = new Array<UserInfo>();
    this.wsInfoCddd.forEach((cddd) => {
      if (cddd.role == "BoardMember") this.wsInfoCd.push(cddd);
      if (cddd.role == "DepartmentDirector") this.wsInfoDd.push(cddd);
    });

    this.wsInfoParticipantsFeedback = Array(
      this.wsInfoParticipants.length
    ).fill(undefined);
    for (let i = 0; i < this.wsInfoParticipants.length; i++)
      this.wsInfoParticipantsFeedback[i] = await this.sessionService
        .getWorkshopFeedback(this.wsInfoParticipants[i].id, workshop.id)
        .toPromise();

    console.log(this.wsInfoParticipantsFeedback);

    this.modalService.open(wsInfo, { centered: true, size: "lg" });
  }

  getParticipantStatus(participantIndex: number) {
    if (this.parseWorkshopStatus(this.wsInfoOpened) == "Finished")
      if (this.wsInfoParticipantsFeedback[participantIndex] == null)
        return "Waiting for feedback";
      else if (
        this.wsInfoParticipantsFeedback[participantIndex].status == "passed"
      )
        return "Passed";
      else return "Rejected";
    return "Workshop not finished";
  }

  async updateParticipantsFeedbackStatus() {
    for (let i = 0; i < this.wsInfoParticipants.length; i++)
      this.wsInfoParticipantsFeedback[i] = await this.sessionService
        .getWorkshopFeedback(
          this.wsInfoParticipants[i].id,
          this.wsInfoOpened.id
        )
        .toPromise();
  }

  deleteScheduledParticipant(participantId: string, workshopId: number) {
    Swal.fire({
      title: "Are you sure you want to remove the user from this workshop?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .deleteScheduleSlot(participantId, workshopId)
          .subscribe(
            async (_res) => {
              Swal.fire({
                title: "Participant removed from workshop",
                icon: "success",
                timer: 1500,
              });
              this.wsInfoParticipants = await this.sessionService
                .getWorkshopParticipants(this.wsInfoOpened.id)
                .toPromise();

              this.wsInfoParticipantsSchedulerVolunteer =
                await this.sessionService
                  .getVolunteerWhoScheduledRange(
                    this.wsInfoParticipants,
                    this.session.id
                  )
                  .toPromise();
            },
            (err) => {
              Swal.fire({
                title:
                  "There was an issue removing the user...\nPlease try again later",
                icon: "error",
                timer: 1500,
              });
            }
          );
    });
  }

  changeWsInfoDisplay(newDisplay: string) {
    this.wsInfoDisplay = newDisplay;
  }

  canRemoveParticipantFromWS(participantIndex: number) {
    if (
      (this.wsInfoParticipantsSchedulerVolunteer[participantIndex].id ==
        this.currentUser.id ||
        this.currentUser.role == "ProjectManager") &&
      new Date() < this.wsInfoDate
    ) {
      return true;
    }
    return false;
  }

  canParticipateAsVolunteerOrCDDD() {
    if (this.wsInfoDate < new Date()) return "cantApply";
    switch (this.currentUser.role) {
      case "Volunteer":
        let foundVol = false;
        this.wsInfoVolunteers.forEach((vol) => {
          if (vol.id == this.currentUser.id) foundVol = true;
        });
        if (foundVol) return "canRemove";
        else return "canApply";
      case "BoardMember":
        let foundCD = false;
        this.wsInfoCd.forEach((cd) => {
          if (cd.id == this.currentUser.id) foundCD = true;
        });
        if (foundCD) return "canRemove";
        else return "canApply";
      case "DepartmentDirector":
        let foundDD = false;
        console.log(this.wsInfoCddd);
        this.wsInfoDd.forEach((dd) => {
          if (dd.id == this.currentUser.id) foundDD = true;
        });
        if (foundDD) return "canRemove";
        return "canApply";
      default:
        return "cantApply";
    }
  }

  async assignMyself() {
    switch (this.currentUser.role) {
      case "Volunteer":
        if (this.wsInfoNoVolunteers - this.wsInfoVolunteers.length == 0)
          Swal.fire({
            title: "Sorry there are no more volunteers slot available",
            icon: "info",
            showConfirmButton: false,
            timer: 2000,
          });
        else {
          Swal.fire({
            title: "Are you sure you want to participate as a volunteer?",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: "red",
            confirmButtonColor: "green",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
          }).then((res) => {
            if (res.value) {
              let newSchedule: WorkshopSchedule = {
                participantId: this.currentUser.id,
                workshopId: this.wsInfoOpened.id,
                volunteerId: this.currentUser.id,
                type: "Volunteer",
              };
              this.sessionService.postWorkshopSchedule(newSchedule).subscribe(
                (res) => {
                  Swal.fire({
                    title: "Your participation was saved!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  }).then((_) => {
                    this.modalService.dismissAll();
                  });
                },
                (_err) => {
                  Swal.fire({
                    title:
                      "Sorry something went wrong...\nPlease try again later",
                    icon: "error",
                    timer: 2000,
                  });
                }
              );
            }
          });
        }
        break;

      case "BoardMember":
        if (this.wsInfoOpened.numberOfBoardMembers - this.wsInfoCd.length == 0)
          Swal.fire({
            title: "Sorry there are no more board members slot available",
            icon: "info",
            showConfirmButton: false,
            timer: 2000,
          });
        else {
          Swal.fire({
            title: "Are you sure you want to participate to the workshop?",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: "red",
            confirmButtonColor: "green",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
          }).then((res) => {
            if (res.value) {
              let newSchedule: WorkshopSchedule = {
                participantId: this.currentUser.id,
                workshopId: this.wsInfoOpened.id,
                volunteerId: this.currentUser.id,
                type: "CD",
              };
              this.sessionService.postWorkshopSchedule(newSchedule).subscribe(
                (res) => {
                  Swal.fire({
                    title: "Your participation was saved!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  }).then((_) => {
                    this.modalService.dismissAll();
                  });
                },
                (_err) => {
                  Swal.fire({
                    title:
                      "Sorry something went wrong...\nPlease try again later",
                    icon: "error",
                    timer: 2000,
                  });
                }
              );
            }
          });
        }
        break;

      case "DepartmentDirector":
        if (this.wsInfoOpened.numberOfDirectors - this.wsInfoDd.length == 0)
          Swal.fire({
            title: "Sorry there are no more available slots",
            icon: "info",
            showConfirmButton: false,
            timer: 2000,
          });
        else {
          Swal.fire({
            title: "Are you sure you want to participate?",
            icon: "question",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: "red",
            confirmButtonColor: "green",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
          }).then((res) => {
            if (res.value) {
              let newSchedule: WorkshopSchedule = {
                participantId: this.currentUser.id,
                workshopId: this.wsInfoOpened.id,
                volunteerId: this.currentUser.id,
                type: "DD",
              };
              this.sessionService.postWorkshopSchedule(newSchedule).subscribe(
                (res) => {
                  Swal.fire({
                    title: "Your participation was saved!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  }).then((_) => {
                    this.modalService.dismissAll();
                  });
                },
                (_err) => {
                  Swal.fire({
                    title:
                      "Sorry something went wrong...\nPlease try again later",
                    icon: "error",
                    timer: 2000,
                  });
                }
              );
            }
          });
        }
        break;
    }
  }

  async removeMyselfFromWs() {
    Swal.fire({
      title: "Are you sure you don't want to participate anymore?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .deleteScheduleSlot(this.currentUser.id, this.wsInfoOpened.id)
          .subscribe(
            (_) => {
              Swal.fire({
                title: "You are no longer participating!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              }).then((_) => {
                this.modalService.dismissAll();
              });
            },
            (_err) => {
              Swal.fire({
                title:
                  "Sorry there was an error with your request...\nPlease try again later",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          );
    });
  }

  userFeedback: string;
  maximumNumberOfVotes: number[];
  feedbackParticipant: UserInfo;
  numberOfExpectedVotes: number;
  feedbackWorkshop: WorkshopInfo;

  givenNoVotes: number;
  givenYesVotes: number;
  abstainedVotes: number;

  feedbackErrors: string[];
  editFeedbackStatus: string;
  editFeedbackPariticpantIndex: number;

  giveFeedbackModal(participant: UserInfo, workshop: WorkshopInfo, modal) {
    this.userFeedback = "";
    this.feedbackErrors = [];
    this.feedbackWorkshop = workshop;
    this.editFeedbackStatus = undefined;
    this.feedbackParticipant = participant;
    this.editFeedbackPariticpantIndex = undefined;
    this.numberOfExpectedVotes =
      workshop.numberOfBoardMembers +
      workshop.numberOfDirectors +
      workshop.numberOfVolunteers +
      1;

    this.givenNoVotes = 0;
    this.givenYesVotes = 0;
    this.abstainedVotes = 0;

    this.maximumNumberOfVotes = [];
    for (let i = 0; i <= this.numberOfExpectedVotes + 2; i++)
      this.maximumNumberOfVotes.push(i);

    this.modalService.open(modal, { centered: true, size: "lg" });
  }

  viewedWorkshopFeedback: WorkshopFeedback;
  viewFeedbackModal(
    participant: UserInfo,
    workshop: WorkshopInfo,
    participantIndex: number,
    modal
  ) {
    let currentFeedback: WorkshopFeedback =
      this.wsInfoParticipantsFeedback[participantIndex];

    this.viewedWorkshopFeedback =
      this.wsInfoParticipantsFeedback[participantIndex];

    this.feedbackErrors = [];
    this.feedbackWorkshop = workshop;
    this.feedbackParticipant = participant;
    this.givenNoVotes = currentFeedback.noVotes;
    this.userFeedback = currentFeedback.feedback;
    this.givenYesVotes = currentFeedback.yesVotes;
    this.editFeedbackStatus =
      currentFeedback.status == "passed" ? "Passed" : "Rejected";
    this.abstainedVotes = currentFeedback.abstainVotes;
    this.editFeedbackPariticpantIndex = participantIndex;

    this.numberOfExpectedVotes =
      workshop.numberOfBoardMembers +
      workshop.numberOfDirectors +
      workshop.numberOfVolunteers +
      1;

    this.maximumNumberOfVotes = [];
    for (let i = 0; i <= this.numberOfExpectedVotes + 2; i++)
      this.maximumNumberOfVotes.push(i);

    this.modalService.open(modal, { centered: true, size: "lg" });
  }

  canGiveFeedback(participantIndex: number) {
    if (
      this.wsInfoParticipantsFeedback[participantIndex] == null &&
      this.currentUser.role == "ProjectManager" &&
      this.parseWorkshopStatus(this.wsInfoOpened) == "Finished"
    )
      return true;
    return false;
  }

  canDeleteFeedback(participantIndex: number) {
    if (
      this.wsInfoParticipantsFeedback[participantIndex] != null &&
      this.currentUser.role == "ProjectManager"
    )
      return true;
    return false;
  }

  canViewFeedback(participantIndex: number) {
    return this.wsInfoParticipantsFeedback[participantIndex] != null;
  }

  async giveFeedback(feedbackModal, editFeedback?) {
    let actualVotes: number =
      parseInt(this.givenYesVotes.toLocaleString()) +
      parseInt(this.givenNoVotes.toLocaleString()) +
      parseInt(this.abstainedVotes.toLocaleString());

    this.feedbackErrors = [];
    if (this.userFeedback == "")
      this.feedbackErrors.push("Please give user a feedback!");
    if (actualVotes == 0) this.feedbackErrors.push("Total votes can't be 0!");
    if (this.feedbackErrors.length != 0) return;

    if (actualVotes != this.numberOfExpectedVotes) {
      let res = await Swal.fire({
        title: "Votes are not matching",
        text:
          `There are ${this.numberOfExpectedVotes} expected votes` +
          ` and ${actualVotes} actual votes. Continue?`,
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: "red",
        confirmButtonColor: "green",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      });

      if (res.dismiss) return;
    }

    let status: string;
    if (
      parseInt(this.givenYesVotes.toString()) >
      parseInt(this.givenNoVotes.toString())
    )
      status = "passed";
    else status = "rejected";

    console.log(status);

    let newFeedback: WorkshopFeedback = {
      participantId: this.feedbackParticipant.id,
      feedbackGiverId: this.currentUser.id,
      workshopId: this.feedbackWorkshop.id,
      yesVotes: this.givenYesVotes,
      noVotes: this.givenNoVotes,
      abstainVotes: this.abstainedVotes,
      feedback: this.userFeedback,
      status: status,
    };

    if (status == "passed" && !editFeedback) {
      var res = await Swal.fire({
        title:
          `Are you sure you want to pass` +
          ` ${this.feedbackParticipant.firstName} ${this.feedbackParticipant.lastName}`,
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: "red",
        confirmButtonColor: "green",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      });
      if (res.dismiss) return;
    } else if (status == "rejected" && !editFeedback) {
      var res = await Swal.fire({
        title:
          `Are you sure you want to reject` +
          ` ${this.feedbackParticipant.firstName} ${this.feedbackParticipant.lastName}`,
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonColor: "red",
        confirmButtonColor: "green",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      });
      if (res.dismiss) return;
    }

    if (editFeedback == false || editFeedback === undefined)
      this.sessionService.createWorkshopFeedback(newFeedback).subscribe(
        (_) => {
          Swal.fire({
            title: "Feedback was saved succesfully!",
            icon: "success",
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: false,
            timer: 1500,
          }).then(async (_res) => {
            await this.updateParticipantsFeedbackStatus();
            feedbackModal.close();
          });
        },
        (_err) => {
          Swal.fire({
            title: "There was an error...\nFeedback was not saved!",
            icon: "error",
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: false,
            timer: 1500,
          });
        }
      );
    else {
      this.sessionService.editWorkshopFeedback(newFeedback).subscribe(
        (_) => {
          Swal.fire({
            title: "Feedback was updated succesfully!",
            icon: "success",
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: false,
            timer: 1500,
          }).then(async (_res) => {
            await this.updateParticipantsFeedbackStatus();
            feedbackModal.close();
          });
        },
        (_err) => {
          Swal.fire({
            title: "There was an error...\nFeedback was not updated!",
            icon: "error",
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: false,
            timer: 1500,
          });
        }
      );
    }
  }

  async deleteFeedback(participantIndex: string, feedbackModal) {
    Swal.fire({
      title: "Are you sure you want to delete the feedback?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "red",
      confirmButtonColor: "green",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService
          .deleteWorkshopFeedback(
            this.wsInfoParticipantsFeedback[participantIndex]
          )
          .subscribe(async (_) => {
            Swal.fire({
              title: "Feedback deleted succesfully",
              icon: "success",
              showCancelButton: false,
              showConfirmButton: false,
              showCloseButton: false,
              timer: 1500,
            }).then((_) => {
              feedbackModal.close();
            });
            await this.updateParticipantsFeedbackStatus();
          });
    });
  }
}
