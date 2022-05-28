import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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

  constructor() {}

  ngOnInit(): void {
    this.question = this.questionDetails.getQuestion();
    this.required = this.questionDetails.getRequired();
  }

  updateQuestionText() {
    this.questionDetails.setQuestion(this.question);
    var newQuestion = new UpdateQuestion(this.questionDetails, this.position);
    this.updateQuestion.emit(newQuestion);
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
