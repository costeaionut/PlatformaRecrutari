import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";
import { ErrorPosition } from "src/shared/interfaces/session/error-position";

@Component({
  selector: "app-select-box-question-display",
  templateUrl: "./select-box-question-display.component.html",
  styleUrls: ["./select-box-question-display.component.css"],
})
export class SelectBoxQuestionDisplayComponent implements OnInit {
  @Input() question: SelectBoxesQuestion;
  @Input() position: number;
  @Input() canAnswer: number;
  @Input() answer: string;

  @Output() changeAnswer: EventEmitter<AnswerPosition> =
    new EventEmitter<AnswerPosition>();
  @Output() changeError: EventEmitter<ErrorPosition> =
    new EventEmitter<ErrorPosition>();

  error: string;
  touched: boolean;
  hasError: boolean;
  checkboxes = new Map<string, boolean>();

  constructor() {}

  ngOnInit() {
    this.touched = false;
    this.question.getOptions().forEach((option) => {
      this.checkboxes[option] = false;
    });
    if (this.answer != "") {
      let splitAnswersInput: Array<string> = this.answer.split(";;");
      splitAnswersInput.forEach((option) => {
        if (this.question.getOptions().includes(option))
          this.checkboxes[option] = true;
      });
    }
  }

  checkForErrors(): boolean {
    if (this.touched && this.question.getRequired() && this.answer == "") {
      this.error = "This question is required! Please select at least one box.";
      this.hasError = true;
      return true;
    }
    this.error = "";
    this.hasError = false;
    return false;
  }

  updateAnswer() {
    this.answer = "";
    this.touched = true;
    this.question.getOptions().forEach((option) => {
      if (this.answer == "") {
        if (this.checkboxes[option]) this.answer += `${option}`;
      } else if (this.checkboxes[option]) this.answer += `;;${option}`;
    });

    let res: boolean = this.checkForErrors();

    let newErrorStatuts: ErrorPosition = {
      hasError: res,
      position: this.position,
    };

    let newAnswer: AnswerPosition = {
      answer: this.answer,
      position: this.position,
    };

    this.changeAnswer.emit(newAnswer);
    this.changeError.emit(newErrorStatuts);
  }
}
