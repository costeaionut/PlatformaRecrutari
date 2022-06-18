import { Component, Input, OnInit } from "@angular/core";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";

@Component({
  selector: "app-multiple-question-display",
  templateUrl: "./multiple-question-display.component.html",
  styleUrls: ["./multiple-question-display.component.css"],
})
export class MultipleQuestionDisplayComponent implements OnInit {
  @Input() question: MultipleQuestion;
  @Input() position: number;
  @Input() canAnswer: boolean;

  options: string[];
  selectedOption: string;
  constructor() {}

  ngOnInit() {
    this.options = this.question.getOptions();
  }
}
