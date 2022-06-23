import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { UpdateQuestion } from "src/shared/classes/questions/update-question";

@Component({
  selector: "app-grid-multiple-options-question",
  templateUrl: "./grid-multiple-options-question.component.html",
  styleUrls: ["./grid-multiple-options-question.component.css"],
})
export class GridMultipleOptionsQuestionComponent implements OnInit {
  @Input() position: number;
  @Input() disabled: boolean;
  @Input() questionDetails: GridMultipleOptions;

  @Output() deleteQuestion = new EventEmitter<number>();
  @Output() updateQuestion = new EventEmitter<UpdateQuestion>();
  question: string;
  questionType: string;
  rows: Array<string>;
  columns: Array<string>;
  required: boolean;
  requiredOneAnswerPerColumn: boolean;

  constructor() {}

  ngOnInit() {
    this.rows = this.questionDetails.getRows();
    this.requiredOneAnswerPerColumn =
      this.questionDetails.getOneAnswearPerColumn();
    this.columns = this.questionDetails.getColumns();
    this.question = this.questionDetails.getQuestion();
    this.questionType = this.questionDetails.getType();
    this.required = this.questionDetails.getRequired();
  }

  deleteThis() {
    this.deleteQuestion.emit(this.position);
  }

  addRow() {
    this.rows.push("Row " + (this.rows.length + 1));
    this.updateQuestionRows();
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
    this.updateQuestionRows();
  }

  removeColumn(index: number) {
    this.columns.splice(index, 1);
    this.updateQuestionColumns();
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

  updateQuestionType(newType: string) {
    switch (newType) {
      case "ShortQuestion":
        var newShortQuestion = new ShortQuestion(
          this.questionDetails.getQuestion(),
          false
        );

        this.updateQuestion.emit(
          new UpdateQuestion(newShortQuestion, this.position)
        );
        break;

      case "MultipleQuestion":
        var newMultipleQuestion = new MultipleQuestion(
          this.questionDetails.getQuestion(),
          this.questionDetails.getColumns(),
          this.questionDetails.getRequired()
        );

        this.updateQuestion.emit(
          new UpdateQuestion(newMultipleQuestion, this.position)
        );

        break;

      case "SelectBoxesQuestion":
        var newSelectBoxes = new SelectBoxesQuestion(
          this.questionDetails.getQuestion(),
          this.questionDetails.getColumns(),
          this.questionDetails.getRequired()
        );

        this.updateQuestion.emit(
          new UpdateQuestion(newSelectBoxes, this.position)
        );

        break;

      case "GridSelectQuestion":
        var newGridSelectQuestion = new GridSelectBoxes(
          this.questionDetails.getQuestion(),
          this.questionDetails.getRows(),
          this.questionDetails.getColumns(),
          this.questionDetails.getOneAnswearPerColumn(),
          this.questionDetails.getRequired()
        );

        this.updateQuestion.emit(
          new UpdateQuestion(newGridSelectQuestion, this.position)
        );
    }
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

  updateQuestionRequired() {
    this.questionDetails.setRequired(!this.required);
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

  updateQuestionMaximumOneAnswerPerColumn() {
    this.questionDetails.setOneAnswearPerColumn(
      !this.requiredOneAnswerPerColumn
    );
    var updatedQuestion = new UpdateQuestion(
      this.questionDetails,
      this.position
    );

    this.updateQuestion.emit(updatedQuestion);
  }
}
