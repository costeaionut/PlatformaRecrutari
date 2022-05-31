import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-grid-select-boxes-question",
  templateUrl: "./grid-select-boxes-question.component.html",
  styleUrls: ["./grid-select-boxes-question.component.css"],
})
export class GridSelectBoxesQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() questionDetails: GridSelectBoxes;

  @Output() deleteQuestion = new EventEmitter<number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();

  question: String;
  questionType: String;

  constructor() {}

  ngOnInit() {
    this.question = this.questionDetails.getQuestion();
    this.questionType = this.questionDetails.getType();
  }

  updateQuestionType(newType: String) {
    console.log("New type:" + newType);
  }

  updateQuestionText() {
    this.questionDetails.setQuestion(this.question);
    var updatedQuestion = new UpdateQuestion(
      this.questionDetails,
      this.position
    );
    this.updateQuestion.emit(updatedQuestion);
  }
}
