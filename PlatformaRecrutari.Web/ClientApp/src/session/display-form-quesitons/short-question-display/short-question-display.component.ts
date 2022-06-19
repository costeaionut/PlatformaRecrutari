import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";
import { ErrorPosition } from "src/shared/interfaces/session/error-position";

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
  @Output() changeError: EventEmitter<ErrorPosition> =
    new EventEmitter<ErrorPosition>();

  touched: boolean;
  hasError: boolean;
  error: string;

  constructor() {}

  ngOnInit() {
    this.touched = false;
  }

  checkForErrors() {
    if (this.touched && this.question.getRequired() && this.answer === "") {
      this.hasError = true;
      this.error = "This question is required. Please type in your answer!";
      return true;
    }
    this.error = "";
    this.hasError = false;
    return false;
  }

  updateAnswer() {
    this.touched = true;

    let res: boolean = this.checkForErrors();
    let newErrors: ErrorPosition = {
      hasError: res,
      position: this.position,
    };

    let newAnswer: AnswerPosition = {
      answer: this.answer,
      position: this.position,
    };
    this.changeError.emit(newErrors);
    this.changeAnswer.emit(newAnswer);
  }
}
