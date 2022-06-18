import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";

@Component({
  selector: "app-short-question-display",
  templateUrl: "./short-question-display.component.html",
  styleUrls: ["./short-question-display.component.css"],
})
export class ShortQuestionDisplayComponent implements OnInit {
  @Input() question: ShortQuestion;
  @Input() position: number;
  @Input() canAnswer: boolean;
  @Input() answer: string;

  @Output() changeAnswer: EventEmitter<AnswerPosition> =
    new EventEmitter<AnswerPosition>();

  constructor() {}

  ngOnInit() {}

  updateAnswer() {
    let newAnswer: AnswerPosition = {
      answer: this.answer,
      position: this.position,
    };
    this.changeAnswer.emit(newAnswer);
  }
}
