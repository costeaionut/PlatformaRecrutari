import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { WorkshopInfo } from "src/shared/interfaces/workshop/workshop-info";
import { WorkshopSchedule } from "src/shared/interfaces/workshop/workshop-schedule";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-workshop-manager",
  templateUrl: "./workshop-manager.component.html",
  styleUrls: ["./workshop-manager.component.css"],
})
export class WorkshopManagerComponent implements OnInit {
  @Input() session: SessionInfo;
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

  newSchedule() {
    this.scheduleErrors = [];

    if (this.selectedParticipant == undefined)
      this.scheduleErrors.push("Please select a user to schedule!");

    if (this.scheduleErrors.length != 0) return;

    let schedule: WorkshopSchedule = {
      participantId: this.selectedParticipant.id,
      workshopId: this.openedWorkshopSchedule.id,
      volunteerId: this.currentUser.id,
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
}
