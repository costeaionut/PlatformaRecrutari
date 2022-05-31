import { Component, OnInit } from "@angular/core";
import { FormInfo } from "src/shared/interfaces/form/formInfo";

@Component({
  selector: "app-session-manager",
  templateUrl: "./session-manager.component.html",
  styleUrls: ["./session-manager.component.css"],
})
export class SessionManagerComponent implements OnInit {
  currentStep: number;
  sessionInfo: SessionInfo;
  formInfo: FormInfo;

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

    this.formInfo = {
      title: "",
      description: "",
      questions: [],
    };
  }

  createSession = (): void => {
    console.log("Session info: " + this.sessionInfo);
    console.log("Form info: " + this.formInfo);
  };

  changePage = (page: number): void => {
    if (
      (page === 1 && this.currentStep !== 3) ||
      (page === -1 && this.currentStep !== 1)
    ) {
      this.currentStep += page;
    }
  };

  updateSession = (newValues: SessionInfo): void => {
    this.sessionInfo = newValues;
  };

  updateFormInfo = (newFormInfo: FormInfo): void => {
    this.formInfo = newFormInfo;
  };
}
