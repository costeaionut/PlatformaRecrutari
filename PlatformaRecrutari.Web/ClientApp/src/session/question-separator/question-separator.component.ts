import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridMultipleOptions } from "src/shared/classes/questions/grid-multiple-options-question";
import { GridSelectBoxes } from "src/shared/classes/questions/grid-select-boxes-question";
import { MultipleQuestion } from "src/shared/classes/questions/multiple-question";
import { Question } from "src/shared/classes/questions/question";
import { SelectBoxesQuestion } from "src/shared/classes/questions/select-boxes-question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { QuestionTypes } from "src/shared/enums/question-types-separator";
import { QuestionPosition } from "src/shared/interfaces/session/question-position";
import Swal from "sweetalert2";

@Component({
  selector: "app-question-separator",
  templateUrl: "./question-separator.component.html",
  styleUrls: ["./question-separator.component.css"],
})
export class QuestionSeparatorComponent implements OnInit {
  @Input() position: number;
  @Output() newQuestion = new EventEmitter<QuestionPosition>();
  constructor() {}

  ngOnInit() {}

  generateQuestion = async (questionType: String): Promise<Question> => {
    switch (questionType) {
      case QuestionTypes.Short:
        return new ShortQuestion("", false);
      case QuestionTypes.Multiple:
        return new MultipleQuestion("", ["Option 1"], false);
      case QuestionTypes.SelectBoxes:
        return new SelectBoxesQuestion("", ["Option 1"], false);
      case QuestionTypes.GridMultiple:
        return new GridMultipleOptions(
          "",
          ["Row 1"],
          ["Column 1"],
          false,
          false
        );
      case QuestionTypes.GridSelect:
        return new GridSelectBoxes("", ["Row 1"], ["Column 1"], false, false);
      default:
        return null;
    }
  };

  addQuestion = async () => {
    const { value: questionType } = await Swal.fire({
      icon: "question",
      title: "Which type of question do you want to add?",
      input: "select",
      inputOptions: {
        SHORT: "Short Answear",
        MULTIPLE: "Multiple Answears",
        SELECT: "Select Boxes",
        GRIDMULTIPLE: "Multiple Answears Grid",
        GRIDSELECT: "Select Boxes Grid",
      },
      inputPlaceholder: "Question Type",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to chose something";
        }
      },
    });

    const newQuestion: Question = await this.generateQuestion(questionType);

    if (!newQuestion) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error creating your question! Please try again later :)",
        footer: '<a href="">Why do I have this issue?</a>',
      });
      return;
    }

    let question: QuestionPosition = {
      position: this.position + 1,
      question: newQuestion,
    };

    this.newQuestion.emit(question);
  };
}
