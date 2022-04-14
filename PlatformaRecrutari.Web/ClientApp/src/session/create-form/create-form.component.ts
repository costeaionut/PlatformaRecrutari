import { Component, Input, OnInit } from "@angular/core";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
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

  addQuestion(value: QuestionPosition) {
    this.questions.splice(value.position, 0, value);
    for (let index = 0; index < this.questions.length; index++) {
      this.questions[index].position = index;
    }
  }

  deleteQuestion(value: number) {
    this.questions.splice(value, 1);
    for (let index = 0; index < this.questions.length; index++) {
      this.questions[index].position = index;
    }
  }
}
