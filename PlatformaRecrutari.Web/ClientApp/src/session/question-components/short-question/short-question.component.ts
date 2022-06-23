import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-short-question",
  templateUrl: "./short-question.component.html",
  styleUrls: ["./short-question.component.css"],
})
export class ShortQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() disabled: boolean;
  @Input() questionDetails: ShortQuestion;
  @Output() deleteQuestion = new EventEmitter<Number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();

  question: string;
  required: boolean;
  questionType: string;

  constructor() {}

  ngOnInit(): void {
    this.question = this.questionDetails.getQuestion();
    this.required = this.questionDetails.getRequired();
    this.questionType = this.questionDetails.getType();
    console.log(this.questionType);
  }

  updateQuestionText() {
    this.questionDetails.setQuestion(this.question);
    var newQuestion = new UpdateQuestion(this.questionDetails, this.position);
    this.updateQuestion.emit(newQuestion);
  }

  updateQuestionType(newType: string) {
    switch (newType) {
      case "MultipleQuestion":
        var newMultipleQuestion = new MultipleQuestion(
          this.questionDetails.getQuestion(),
          ["Option 1"],
          this.questionDetails.getRequired()
        );

        var updatedQuestionWithNewType = new UpdateQuestion(
          newMultipleQuestion,
          this.position
        );

        this.updateQuestion.emit(updatedQuestionWithNewType);

        break;
      case "SelectBoxesQuestion":
        var newSelectBoxesQuestion = new SelectBoxesQuestion(
          this.questionDetails.getQuestion(),
          ["Option 1"],
          this.questionDetails.getRequired()
        );

        var updatedQuestionWithNewType = new UpdateQuestion(
          newSelectBoxesQuestion,
          this.position
        );

        this.updateQuestion.emit(updatedQuestionWithNewType);
        break;
      case "GridMultipleQuestion":
        var newGridMultipleQuestion = new GridMultipleOptions(
          this.questionDetails.getQuestion(),
          ["Row 1"],
          ["Column 1"],
          false,
          this.questionDetails.getRequired()
        );

        var updatedQuestionWithNewType = new UpdateQuestion(
          newGridMultipleQuestion,
          this.position
        );

        this.updateQuestion.emit(updatedQuestionWithNewType);
        break;
      case "GridSelectQuestion":
        var newGridSelectQuestion = new GridSelectBoxes(
          this.questionDetails.getQuestion(),
          ["Row 1"],
          ["Column 1"],
          false,
          this.questionDetails.getRequired()
        );

        var updatedQuestionWithNewType = new UpdateQuestion(
          newGridSelectQuestion,
          this.position
        );

        this.updateQuestion.emit(updatedQuestionWithNewType);
    }
  }

  updateQuestionRequired() {
    this.questionDetails.setRequired(!this.required);
    var newQuestion = new UpdateQuestion(this.questionDetails, this.position);
    this.updateQuestion.emit(newQuestion);
    console.log(newQuestion);
  }

  deleteThis() {
    this.deleteQuestion.emit(this.position);
  }
}
