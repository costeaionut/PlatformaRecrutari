import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";

@Component({
  selector: "app-multiple-question-display",
  templateUrl: "./multiple-question-display.component.html",
  styleUrls: ["./multiple-question-display.component.css"],
})
export class MultipleQuestionDisplayComponent implements OnInit {
  @Input() question: MultipleQuestion;
  @Input() position: number;
  @Input() canAnswer: boolean;
  @Input() answer: string;
  @Output() changeAnswer: EventEmitter<AnswerPosition> =
    new EventEmitter<AnswerPosition>();
  options: string[];
  selectedOption: string;
  constructor() {}

  ngOnInit() {
    this.options = this.question.getOptions();
    if (this.answer != "" && this.options.includes(this.answer))
      this.selectedOption = this.answer;
  }

  updateAnswer() {
    let newAnswer: AnswerPosition = {
      answer: this.selectedOption,
      position: this.position,
    };
    console.log(newAnswer);
    this.changeAnswer.emit(newAnswer);
  }
}
