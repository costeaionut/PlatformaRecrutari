import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-session-manager",
  templateUrl: "./session-manager.component.html",
  styleUrls: ["./session-manager.component.css"],
})
export class SessionManagerComponent implements OnInit {
  currentStep: number;
  sessionInfo: SessionInfo;

  constructor() {}

  ngOnInit() {
    this.currentStep = 1;
    this.sessionInfo = {
      title: "",
      creatorId: "",
      startDate: new Date(),
      endDate: new Date(),
      isOpen: false,
    };
  }

  changePage = (page: number): void => {
    if (
      (page === 1 && this.currentStep !== 4) ||
      (page === -1 && this.currentStep !== 1)
    ) {
      this.currentStep += page;
    }
  };

  updateSession = (newValues: SessionInfo): void => {
    this.sessionInfo = newValues;
  };
}
