import { Component, Input, OnInit } from "@angular/core";
import { FormInfo } from "src/shared/interfaces/form/formInfo";

@Component({
  selector: "app-session-creation-review",
  templateUrl: "./session-creation-review.component.html",
  styleUrls: ["./session-creation-review.component.css"],
})
export class SessionCreationReviewComponent implements OnInit {
  @Input() formInfo: FormInfo;
  @Input() parentChangePage;
  @Input() parentCreateSession;
  @Input() submittingForm;

  answers: Array<string>;

  constructor() {}

  ngOnInit() {
    this.answers = Array(this.formInfo.questions.length).fill("");
  }

  changePage = (direction: number): void => {
    this.parentChangePage(direction);
  };

  createSession() {
    this.parentCreateSession();
  }
}
