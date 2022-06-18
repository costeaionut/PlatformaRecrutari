import { Component, Input, OnInit } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";

@Component({
  selector: "app-grid-multiple-question-display",
  templateUrl: "./grid-multiple-question-display.component.html",
  styleUrls: ["./grid-multiple-question-display.component.css"],
})
export class GridMultipleQuestionDisplayComponent implements OnInit {
  @Input() question: GridMultipleOptions;
  @Input() position: number;
  @Input() canAnswer: boolean;

  constructor() {}

  ngOnInit() {}
}
