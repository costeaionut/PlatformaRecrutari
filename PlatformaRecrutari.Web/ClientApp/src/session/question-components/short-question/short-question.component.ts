import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-short-question",
  templateUrl: "./short-question.component.html",
  styleUrls: ["./short-question.component.css"],
})
export class ShortQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() questionDetails: ShortQuestion;
  @Output() deleteQuestion = new EventEmitter<Number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();

  question: String;
  required: boolean;
  questionType: String;

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

  updateQuestionType(newType: String) {
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
