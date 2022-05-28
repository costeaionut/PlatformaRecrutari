import { Component, Input, OnInit } from "@angular/core";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";
import { QuestionPosition } from "src/shared/interfaces/session/question-position";

@Component({
  selector: "app-create-form",
  templateUrl: "./create-form.component.html",
  styleUrls: ["./create-form.component.css"],
})
export class CreateFormComponent implements OnInit {
  @Input() parentChangePage;
  public questions: Array<QuestionPosition>;

  constructor() {}

  ngOnInit() {
    this.questions = new Array<QuestionPosition>();
  }

  changePage = (direction: number): void => this.parentChangePage(direction);

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
