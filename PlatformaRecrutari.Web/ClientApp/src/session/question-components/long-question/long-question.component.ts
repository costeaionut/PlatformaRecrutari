import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LongQuestion } from "src/shared/classes/questions/long-question";

@Component({
  selector: "app-long-question",
  templateUrl: "./long-question.component.html",
  styleUrls: ["./long-question.component.css"],
})
export class LongQuestionComponent implements OnInit {
  @Input() questionDetails: LongQuestion;
  @Input() position: number;
  @Output() deleteQuestion = new EventEmitter<Number>();

  constructor() {}

  ngOnInit() {}

  deleteThis() {
    this.deleteQuestion.emit(this.position);
  }
}
