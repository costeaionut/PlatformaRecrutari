import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-grid-select-boxes-question",
  templateUrl: "./grid-select-boxes-question.component.html",
  styleUrls: ["./grid-select-boxes-question.component.css"],
})
export class GridSelectBoxesQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() questionDetails: GridSelectBoxes;

  @Output() deleteQuestion = new EventEmitter<number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();

  constructor() {}

  ngOnInit() {}
}
