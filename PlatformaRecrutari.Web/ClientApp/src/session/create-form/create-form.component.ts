import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
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
  public hasErrors: boolean;
  public errors: Array<string>;

  constructor() {}

  ngOnInit() {
    this.title = this.formInfo.title;
    this.questions = this.formInfo.questions;
    this.description = this.formInfo.description;
    this.formStartDate = new Date();
    this.formEndDate = new Date();

    this.hasErrors = false;
    this.errors = [];
  }

  checkQuestions() {
    console.log(this.questions);
  }

  // Returns true if date1 is smaller than date2
  compareDatesWithoutTimes(date1: Date, date2: Date) {
    if (date1.getFullYear() < date2.getFullYear()) return true;
    if (date1.getFullYear() === date2.getFullYear()) {
      if (date1.getMonth() < date2.getMonth()) return true;
      if (date1.getMonth() === date1.getMonth()) {
        if (date1.getDay() < date2.getDay()) return true;
      }
    }
    return false;
  }

  errorChecker(): Array<string> {
    let localErrors: string[] = [];
    if (this.title.length == 0) localErrors.push("Title can't be empty!");

    if (this.formStartDate > this.formEndDate)
      localErrors.push("Start date can't be smaller than end date!");

    if (this.compareDatesWithoutTimes(this.formStartDate, new Date()))
      localErrors.push("Start date can't be set earlier than today!");

    if (this.description.length == 0)
      localErrors.push("Description can't be empty");

    if (this.questions.length == 0)
      localErrors.push("The form can't be empty! Add some questions.");

    for (let index = 0; index < this.questions.length; index++) {
      const currentElement = this.questions[index];

      switch (currentElement.question.getType()) {
        case "ShortQuestion":
          let castedShortQuestion: ShortQuestion =
            currentElement.question as ShortQuestion;
          if (castedShortQuestion.getQuestion().length == 0)
            localErrors.push(
              `Entry no.${index + 1} can't have an empty question!`
            );
          break;

        case "MultipleQuestion":
          let castedMultipleQuestion: MultipleQuestion =
            currentElement.question as MultipleQuestion;
          let multipleOptions = castedMultipleQuestion.getOptions();

          if (castedMultipleQuestion.getQuestion().length == 0)
            localErrors.push(
              `Entry no.${index + 1} can't have an empty question!`
            );

          if (multipleOptions.length == 0) {
            localErrors.push(`Entry no.${index + 1} must have select options`);
          } else {
            if (multipleOptions.length != new Set(multipleOptions).size)
              localErrors.push(`Entry no.${index + 1} has duplicated options!`);
          }

          break;

        case "SelectBoxesQuestion":
          let castedSelectQuestion: SelectBoxesQuestion =
            currentElement.question as SelectBoxesQuestion;
          let selectOptions = castedSelectQuestion.getOptions();

          if (castedSelectQuestion.getQuestion().length == 0)
            localErrors.push(
              `Entry no.${index + 1} can't have an empty question!`
            );

          if (selectOptions.length == 0) {
            localErrors.push(`Entry no.${index + 1} must have select options`);
          } else {
            if (selectOptions.length != new Set(selectOptions).size)
              localErrors.push(`Entry no.${index + 1} has duplicated options!`);
          }
          break;

        case "GridMultipleQuestion":
          const castedGridMultiple: GridMultipleOptions =
            currentElement.question as GridMultipleOptions;
          let gridMultipleRows = castedGridMultiple.getRows();
          let gridMultipleCols = castedGridMultiple.getColumns();

          if (castedGridMultiple.getQuestion().length == 0)
            localErrors.push(
              `Entry no.${index + 1} can't have an empty question!`
            );

          if (gridMultipleRows.length == 0)
            localErrors.push(
              `Entry no.${index + 1} must have at leas one row!`
            );
          else {
            if (gridMultipleRows.length != new Set(gridMultipleRows).size)
              localErrors.push(`Entry no.${index + 1} has duplicated rows!`);
          }

          if (gridMultipleCols.length == 0)
            localErrors.push(
              `Entry no.${index + 1} must have at least 1 column!`
            );
          else {
            if (gridMultipleCols.length != new Set(gridMultipleCols).size)
              localErrors.push(`Entry no.${index + 1} has duplicated columns!`);
          }

          break;

        case "GridSelectQuestion":
          const castedGridSelect: GridSelectBoxes =
            currentElement.question as GridSelectBoxes;
          let gridSelectRows = castedGridSelect.getRows();
          let gridSelectCols = castedGridSelect.getColumns();

          if (castedGridSelect.getQuestion().length == 0)
            localErrors.push(
              `Entry no.${index + 1} can't have an empty question!`
            );

          if (gridSelectRows.length == 0)
            localErrors.push(
              `Entry no.${index + 1} must have at leas one row!`
            );
          else {
            if (gridSelectRows.length != new Set(gridSelectRows).size)
              localErrors.push(`Entry no.${index + 1} has duplicated rows!`);
          }

          if (gridSelectCols.length == 0)
            localErrors.push(
              `Entry no.${index + 1} must have at least 1 column!`
            );
          else {
            if (gridSelectCols.length != new Set(gridSelectCols).size)
              localErrors.push(`Entry no.${index + 1} has duplicated columns!`);
          }
          break;

        default:
          break;
      }
    }

    return localErrors;
  }

  changePage = (direction: number): void => {
    this.errors = this.errorChecker();
    console.log(direction);
    if (direction != -1 && this.errors.length != 0) {
      this.hasErrors = true;
    } else {
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
    }
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
