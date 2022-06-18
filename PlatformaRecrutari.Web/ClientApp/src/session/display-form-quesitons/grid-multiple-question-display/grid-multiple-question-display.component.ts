import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";

@Component({
  selector: "app-grid-multiple-question-display",
  templateUrl: "./grid-multiple-question-display.component.html",
  styleUrls: ["./grid-multiple-question-display.component.css"],
})
export class GridMultipleQuestionDisplayComponent implements OnInit {
  @Input() question: GridMultipleOptions;
  @Input() position: number;
  @Input() canAnswer: boolean;
  @Input() answer: string;
  @Output() changeAnswer: EventEmitter<AnswerPosition> =
    new EventEmitter<AnswerPosition>();

  error: string;
  touched: boolean;
  hasError: boolean;
  answerGrid: Array<number>;

  constructor() {}

  ngOnInit() {
    this.answerGrid = Array(this.question.getRows().length).fill(-1);
    this.touched = false;
    this.hasError = false;
    this.error = "";

    if (this.answer != "") {
      let rowsAndSelections: string[] = this.answer.split(";;");
      rowsAndSelections.forEach((currentSelection) => {
        let row: string = currentSelection.split("::")[0];
        let selection: string = currentSelection.split("::")[1];

        let rowIndex: number = this.question.getRows().indexOf(row);
        let selectionIndex: number = this.question
          .getColumns()
          .indexOf(selection);

        this.answerGrid[rowIndex] = selectionIndex;
      });
    }
  }

  findDuplicates = (arr) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

  checkForErrors(): boolean {
    if (this.touched) {
      if (this.question.getOneAnswearPerColumn()) {
        let duplicatedItems: number[] = this.findDuplicates(this.answerGrid);
        for (let i = 0; i < duplicatedItems.length; i++) {
          if (duplicatedItems[i] != -1) {
            this.hasError = true;
            this.error = "Please choose only one answer per column!";
            return true;
          }
        }
      }
      if (this.question.getRequired()) {
        for (let i = 0; i < this.answerGrid.length; i++) {
          if (this.answerGrid[i] == -1) {
            this.hasError = true;
            this.error = "Please choose at least one answer per row!";
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

    for (let i = 0; i < rows.length; i++) {
      this.answer += `${rows[i]}::`;
      let selectedCol: string = cols[this.answerGrid[i]];
      if (i + 1 == rows.length) this.answer += `${selectedCol}`;
      else this.answer += `${selectedCol};;`;
    }

    let newAnswer: AnswerPosition = {
      answer: this.answer,
      position: this.position,
    };

    this.changeAnswer.emit(newAnswer);
  }

  selectCheckbox(row: number, col: number) {
    this.touched = true;
    this.answerGrid[row] = col;
    this.checkForErrors();
    this.constructAnswer();
  }
}
