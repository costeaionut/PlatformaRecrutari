import { Component, Input, OnInit } from "@angular/core";
import { ShortQuestion } from "src/shared/classes/questions/short-question";

@Component({
  selector: "app-short-question-display",
  templateUrl: "./short-question-display.component.html",
  styleUrls: ["./short-question-display.component.css"],
})
export class ShortQuestionDisplayComponent implements OnInit {
  @Input() question: ShortQuestion;
  @Input() position: number;
  @Input() canAnswer: boolean;

  answer: string;

  constructor() {}

  ngOnInit() {}
}
