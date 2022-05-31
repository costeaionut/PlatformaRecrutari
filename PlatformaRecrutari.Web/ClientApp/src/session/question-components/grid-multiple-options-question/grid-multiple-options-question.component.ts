import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-grid-multiple-options-question",
  templateUrl: "./grid-multiple-options-question.component.html",
  styleUrls: ["./grid-multiple-options-question.component.css"],
})
export class GridMultipleOptionsQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() questionDetails: GridMultipleOptions;

  @Output() deleteQuestion = new EventEmitter<number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();

  constructor() {}

  ngOnInit() {}
}
