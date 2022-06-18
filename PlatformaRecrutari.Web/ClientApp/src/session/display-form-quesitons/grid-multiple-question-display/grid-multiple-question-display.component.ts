import { Component, Input, OnInit } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";

@Component({
  selector: "app-grid-multiple-question-display",
  templateUrl: "./grid-multiple-question-display.component.html",
  styleUrls: ["./grid-multiple-question-display.component.css"],
})
export class GridMultipleQuestionDisplayComponent implements OnInit {
  @Input() question: GridMultipleOptions;
  @Input() position: number;
  @Input() canAnswer: boolean;

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
            this.error = "Please choose at leas one answer per row!";
            return true;
          }
        }
      }
    }

    this.hasError = false;
    this.error = "";
    return false;
  }

  selectCheckbox(row: number, col: number) {
    this.touched = true;
    this.answerGrid[row] = col;
    this.checkForErrors();
  }
}
