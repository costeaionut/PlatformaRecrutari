import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-multiple-options-question",
  templateUrl: "./multiple-options-question.component.html",
  styleUrls: ["./multiple-options-question.component.css"],
})
export class MultipleOptionsQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() disabled: boolean;
  @Input() questionDetails: MultipleQuestion;

  @Output() deleteQuestion = new EventEmitter<number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();

  question: string;
  options: string[];
  required: boolean;
  questionType: string;

  constructor() {}

  ngOnInit() {
    this.options = this.questionDetails.getOptions();
    this.question = this.questionDetails.getQuestion();
    this.questionType = this.questionDetails.getType();
    this.required = this.questionDetails.getRequired();
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  addOption() {
    var newOption = "Option " + (this.options.length + 1);
    this.options.push(newOption);
    this.updateQuestionOptions();
  }

  deleteThis() {
    this.deleteQuestion.emit(this.position);
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
    this.updateQuestionOptions();
  }

  updateQuestionText() {
    this.questionDetails.setQuestion(this.question);
    var updatedQuestion = new UpdateQuestion(
      this.questionDetails,
      this.position
    );
    this.updateQuestion.emit(updatedQuestion);
  }

  updateQuestionOptions() {
    this.questionDetails.setOptions(this.options);
    var updatedQuesiton = new UpdateQuestion(
      this.questionDetails,
      this.position
    );
    this.updateQuestion.emit(updatedQuesiton);
  }

  updateQuestionRequired() {
    this.questionDetails.setRequired(!this.required);
    var updatedQuestion = new UpdateQuestion(
      this.questionDetails,
      this.position
    );
    this.updateQuestion.emit(updatedQuestion);
  }

  updateQuestionType(newType: string) {
    switch (newType) {
      case "ShortQuestion":
        var newShortQuestion = new ShortQuestion(
          this.questionDetails.getQuestion(),
          this.questionDetails.getRequired()
        );

        var updatedQuestionWithNewType = new UpdateQuestion(
          newShortQuestion,
          this.position
        );

        this.updateQuestion.emit(updatedQuestionWithNewType);

        break;
      case "SelectBoxesQuestion":
        var newSelectBoxesQuestion = new SelectBoxesQuestion(
          this.questionDetails.getQuestion(),
          this.questionDetails.getOptions(),
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
          this.questionDetails.getOptions(),
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
          this.questionDetails.getOptions(),
          false,
          this.questionDetails.getRequired()
        );

        var updatedQuestionWithNewType = new UpdateQuestion(
          newGridSelectQuestion,
          this.position
        );
        this.updateQuestion.emit(updatedQuestionWithNewType);
        break;
    }
  }
}
