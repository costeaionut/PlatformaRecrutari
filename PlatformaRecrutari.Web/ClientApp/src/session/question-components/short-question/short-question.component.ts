import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShortQuestion } from "src/shared/classes/questions/short-question";

@Component({
  selector: "app-short-question",
  templateUrl: "./short-question.component.html",
  styleUrls: ["./short-question.component.css"],
})
export class ShortQuestionComponent implements OnInit {
  @Input() questionDetails: ShortQuestion;
  @Input() position: number;
  @Output() deleteQuestion = new EventEmitter<Number>();

  constructor() {}

  ngOnInit() {}

  deleteThis() {
    this.deleteQuestion.emit(this.position);
  }
}
