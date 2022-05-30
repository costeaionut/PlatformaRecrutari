import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-select-boxes-question",
  templateUrl: "./select-boxes-question.component.html",
  styleUrls: ["./select-boxes-question.component.css"],
})
export class SelectBoxesQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() questionDetails: SelectBoxesQuestion;

  @Output() deleteQuestion = new EventEmitter<number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();

  question: String;
  options: String[];
  required: boolean;
  questionType: String;

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

  updateQuestionType(newType: String) {
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
      case "MultipleQuestion":
        var newMultipleQuestion = new MultipleQuestion(
          this.questionDetails.getQuestion(),
          this.questionDetails.getOptions(),
          this.questionDetails.getRequired()
        );
        var updatedQuestionWithNewType = new UpdateQuestion(
          newMultipleQuestion,
          this.position
        );
        this.updateQuestion.emit(updatedQuestionWithNewType);
    }
  }
}
