import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";

@Component({
  selector: "app-grid-select-box-question-display",
  templateUrl: "./grid-select-box-question-display.component.html",
  styleUrls: ["./grid-select-box-question-display.component.css"],
})
export class GridSelectBoxQuestionDisplayComponent implements OnInit {
  @Input() question: GridSelectBoxes;
  @Input() position: number;
  @Input() canAnswer: boolean;
  @Input() answer: string;
  @Output() changeAnswer: EventEmitter<AnswerPosition> =
    new EventEmitter<AnswerPosition>();

  answerGrid: Array<Array<boolean>>;
  hasError: boolean;
  error: string;
  touched: boolean;

  constructor() {}

  ngOnInit() {
    this.answerGrid = new Array<Array<boolean>>();
    this.hasError = false;
    this.touched = false;
    this.error = "";

    this.question.getRows().forEach((row) => {
      let lenght = this.question.getColumns().length;
      this.answerGrid.push(Array(lenght).fill(false));
    });

    if (this.answer != "") {
      let splitRowsSelections: string[] = this.answer.split(";;");
      splitRowsSelections.forEach((rowSelection) => {
        let row: string = rowSelection.split("::")[0];
        let selections: string = rowSelection.split("::")[1];

        let rowIndex: number = this.question.getRows().indexOf(row);
        selections.split(",,").forEach((selection) => {
          let selectionIndex: number = this.question
            .getColumns()
            .indexOf(selection);
          this.answerGrid[rowIndex][selectionIndex] = true;
        });
      });
    }
  }

  checkForErrors(): boolean {
    if (this.touched) {
      if (this.question.getOneAnswearPerColumn()) {
        for (let j = 0; j < this.answerGrid[0].length; j++) {
          let hasMultipleOptionsSelected: boolean = false;
          let numberOfSelected: number = 0;
          for (let i = 0; i < this.answerGrid.length; i++) {
            if (this.answerGrid[i][j]) numberOfSelected++;
            if (numberOfSelected > 1) hasMultipleOptionsSelected = true;
          }
          if (hasMultipleOptionsSelected) {
            this.hasError = true;
            this.error = "Please select only one answer per column!";
            return true;
          }
        }
      }

      if (this.question.getRequired()) {
        for (let i = 0; i < this.answerGrid.length; i++) {
          let hasSelectedOption: boolean = false;
          for (let j = 0; j < this.answerGrid[i].length; j++) {
            if (this.answerGrid[i][j] == true) hasSelectedOption = true;
          }
          if (!hasSelectedOption) {
            this.hasError = true;
            this.error = "Please select at least one answer per row!";
            return true;
          }
        }
      }
    }

    this.hasError = false;
    this.error = "";
    return false;
  }

  constructAnswer() {
    this.answer = "";
    let rows: string[] = this.question.getRows();
    let cols: string[] = this.question.getColumns();

    for (let i = 0; i < this.answerGrid.length; i++) {
      this.answer += `${rows[i]}::`;
      for (let j = 0; j < this.answerGrid[i].length; j++) {
        console.log(this.answer);
        if (this.answerGrid[i][j])
          if (this.answer.substring(this.answer.length - 2) == "::")
            this.answer += `${cols[j]}`;
          else this.answer += `,,${cols[j]}`;
      }
      if (i + 1 != this.answerGrid.length) this.answer += ";;";
    }

    let newAnswer: AnswerPosition = {
      answer: this.answer,
      position: this.position,
    };

    this.changeAnswer.emit(newAnswer);
  }

  selectOption(rowIndex: number, colIndex: number) {
    this.touched = true;
    this.answerGrid[rowIndex][colIndex] = !this.answerGrid[rowIndex][colIndex];
    this.checkForErrors();
    this.constructAnswer();
  }
}
