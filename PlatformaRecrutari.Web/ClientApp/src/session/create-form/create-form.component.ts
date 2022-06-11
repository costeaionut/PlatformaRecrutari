import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { QuestionPosition } from "src/shared/interfaces/session/question-position";

@Component({
  selector: "app-create-form",
  templateUrl: "./create-form.component.html",
  styleUrls: ["./create-form.component.css"],
})
export class CreateFormComponent implements OnInit {
  @Input() parentChangePage;
  @Input() formInfo: FormInfo;
  @Output() updateFormInfo = new EventEmitter<FormInfo>();

  public title: string;
  public description: string;
  public questions: Array<QuestionPosition>;
  public formStartDate: Date;
  public formEndDate: Date;

  constructor() {}

  ngOnInit() {
    this.title = this.formInfo.title;
    this.questions = this.formInfo.questions;
    this.description = this.formInfo.description;
    this.formStartDate = new Date();
    this.formEndDate = new Date();
  }

  checkQuestions() {
    console.log(this.questions);
  }

  changePage = (direction: number): void => {
    this.formInfo = {
      id: 0,
      title: this.title,
      description: this.description,
      questions: this.questions,
      startDate: this.formStartDate,
      endDate: this.formEndDate,
    };

    this.updateFormInfo.emit(this.formInfo);

    this.parentChangePage(direction);
  };

  addQuestion = (value: QuestionPosition): void => {
    this.questions.splice(value.position, 0, value);
    for (let index = 0; index < this.questions.length; index++) {
      this.questions[index].position = index;
    }
  };

  updateQuestion = (updatedQuestion: UpdateQuestion): void => {
    this.questions[updatedQuestion.position].question =
      updatedQuestion.questionDetails;
  };

  deleteQuestion = (value: number): void => {
    this.questions.splice(value, 1);
    for (let index = 0; index < this.questions.length; index++) {
      this.questions[index].position = index;
    }
  };
}
