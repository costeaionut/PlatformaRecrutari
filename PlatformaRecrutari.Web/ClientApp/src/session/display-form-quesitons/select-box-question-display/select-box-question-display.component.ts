import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";

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

  checkboxes = new Map<string, boolean>();

  constructor() {}

  ngOnInit() {
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
  updateAnswer() {
    this.answer = "";
    this.question.getOptions().forEach((option) => {
      if (this.answer == "") {
        if (this.checkboxes[option]) this.answer += `${option}`;
      } else if (this.checkboxes[option]) this.answer += `;;${option}`;
    });

    let newAnswer: AnswerPosition = {
      answer: this.answer,
      position: this.position,
    };

    this.changeAnswer.emit(newAnswer);
  }
}
