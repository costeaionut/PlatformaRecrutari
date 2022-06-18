import { Component, Input, OnInit } from "@angular/core";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";

@Component({
  selector: "app-select-box-question-display",
  templateUrl: "./select-box-question-display.component.html",
  styleUrls: ["./select-box-question-display.component.css"],
})
export class SelectBoxQuestionDisplayComponent implements OnInit {
  @Input() question: SelectBoxesQuestion;
  @Input() position: number;
  @Input() canAnswer: number;

  checkboxes = new Map<string, boolean>();

  constructor() {}

  ngOnInit() {
    this.question.getOptions().forEach((option) => {
      this.checkboxes[option] = false;
    });
  }
}
