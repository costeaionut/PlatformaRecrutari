import { Component, Input, OnInit } from "@angular/core";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";

@Component({
  selector: "app-grid-select-box-question-display",
  templateUrl: "./grid-select-box-question-display.component.html",
  styleUrls: ["./grid-select-box-question-display.component.css"],
})
export class GridSelectBoxQuestionDisplayComponent implements OnInit {
  @Input() question: GridSelectBoxes;
  @Input() position: number;
  @Input() canAnswer: boolean;

  constructor() {}

  ngOnInit() {}
}
