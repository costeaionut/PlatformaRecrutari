import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { WorkshopInfo } from "src/shared/interfaces/workshop/workshop-info";
import Swal from "sweetalert2";

@Component({
  selector: "app-workshop-manager",
  templateUrl: "./workshop-manager.component.html",
  styleUrls: ["./workshop-manager.component.css"],
})
export class WorkshopManagerComponent implements OnInit {
  constructor(private modalService: NgbModal) {}

  newWorkshopDate: Date;
  disaplyDateOfNewWorkshop: string;

  departmentOptions: Map<string, boolean>;
  departments = ["Fundraising", "Educational", "HR", "PR"];
  noParticipantsList = [];

  newWorkshopNoDD: number;
  newWorkshopNoCD: number;
  newWorkshopLocation: string;
  newWorkshopDepartments: string;
  newWorkshopNoVolunteers: number;
  newWorkshopNoParticipants: number;
  newWorkshopFormErrors: string[];

  ngOnInit() {}

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
    this.departmentOptions = new Map<string, boolean>();
    this.departmentOptions.set("Fundraising", false);
    this.departmentOptions.set("Educational", false);
    this.departmentOptions.set("HR", false);
    this.departmentOptions.set("PR", false);

    for (let i = 10; i <= 30; i++) this.noParticipantsList.push(i);

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

  updateHour(newTime: Date) {
    this.newWorkshopDate.setHours(newTime.getHours(), newTime.getMinutes());
    this.updateDateDisplay();
  }

  updateDateDisplay() {
    this.disaplyDateOfNewWorkshop = this.newWorkshopDate.toLocaleDateString();
    this.disaplyDateOfNewWorkshop += `, ${this.newWorkshopDate.toLocaleTimeString()}`;
  }

  saveNewWorkshop() {
    this.checkErrorsOnNewWorkshop();
    if (this.newWorkshopFormErrors.length != 0) {
      return;
    }

    let newWorkshop: WorkshopInfo = {
      id: 0,
      workshopDate: this.newWorkshopDate,
      numberOfDirectors: this.newWorkshopNoDD,
      departments: this.newWorkshopDepartments,
      numberOfBoardMembers: this.newWorkshopNoCD,
      workshopLocation: this.newWorkshopLocation,
      numberOfVolunteers: this.newWorkshopNoVolunteers,
      numberOfParticipants: this.newWorkshopNoParticipants,
    };
    Swal.fire({ title: "Form saved successfully", icon: "success" }).then(
      (_) => {
        console.log(newWorkshop);
        this.modalService.dismissAll();
      }
    );
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
}
