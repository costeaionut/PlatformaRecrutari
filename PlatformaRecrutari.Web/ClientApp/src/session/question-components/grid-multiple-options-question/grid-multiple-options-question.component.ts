import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { create } from "domain";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-grid-multiple-options-question",
  templateUrl: "./grid-multiple-options-question.component.html",
  styleUrls: ["./grid-multiple-options-question.component.css"],
})
export class GridMultipleOptionsQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() questionDetails: GridMultipleOptions;

  @Output() deleteQuestion = new EventEmitter<number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();
  question: String;
  questionType: String;
  rows: Array<String>;
  columns: Array<String>;

  constructor() {}

  ngOnInit() {
    this.question = this.questionDetails.getQuestion();
    this.questionType = this.questionDetails.getType();
    this.rows = this.questionDetails.getRows();
    this.columns = this.questionDetails.getColumns();
  }

  addRow() {
    this.rows.push("Row " + (this.rows.length + 1));
    this.updateQuestionRows();
  }

  addColumn() {
    this.columns.push("Column " + (this.columns.length + 1));
    this.updateQuestionColumns();
  }

  createIndexArray(length: number): Array<number> {
    var indexes = [];
    for (let i = 0; i < length; i++) indexes.push(i);
    return indexes;
  }

  getNumberOfRows(): Array<number> {
    if (this.rows.length > this.columns.length)
      return this.createIndexArray(this.rows.length);
    return this.createIndexArray(this.columns.length);
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

  updateQuestionRows() {
    this.questionDetails.setRows(this.rows);
    var updatedQuestion = new UpdateQuestion(
      this.questionDetails,
      this.position
    );

    this.updateQuestion.emit(updatedQuestion);
  }

  updateQuestionColumns() {
    this.questionDetails.setColumns(this.columns);
    var updatedQuestion = new UpdateQuestion(
      this.questionDetails,
      this.position
    );

    this.updateQuestion.emit(updatedQuestion);
  }
}
