import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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

  newWorkshopNoDD: number;
  newWorkshopNoCD: number;
  newWorkshopLocation: string;
  newWorkshopNoVolunteers: number;
  newWorkshopNoParticipants: number;
  newWorkshopDepartments: Map<string, boolean>;

  open(content) {
    this.newWorkshopDate = null;
    this.newWorkshopLocation = "";
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
    Swal.fire({ title: "Form saved successfully", icon: "success" }).then(
      (_) => {
        console.log(this.newWorkshopLocation);
        console.log(this.newWorkshopDate);
        this.modalService.dismissAll();
      }
    );
  }

  ngOnInit() {}
}
