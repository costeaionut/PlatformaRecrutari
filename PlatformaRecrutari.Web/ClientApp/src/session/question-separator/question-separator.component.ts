import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LongQuestion } from "src/shared/classes/questions/long-question";
import { Question } from "src/shared/classes/questions/question";
import { ShortQuestion } from "src/shared/classes/questions/short-question";
import { QuestionTypes } from "src/shared/enums/question-types";
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
      case QuestionTypes.Long:
        const { value: questionValues } = await Swal.fire({
          icon: "info",
          title: "What is the question?",
          input: "text",
          inputPlaceholder: "Question",
        });

        if (!questionValues) return;

        const { value: required } = await Swal.fire({
          title: "Is the question required?",
          input: "radio",
          inputOptions: {
            YES: "Yes",
            NO: "No",
          },
          showCancelButton: true,
        });

        if (!required) return;

        if (questionType === QuestionTypes.Short)
          return new ShortQuestion(
            questionValues,
            required == "YES" ? true : false
          );
        else
          return new LongQuestion(
            questionValues,
            required == "YES" ? true : false
          );

      default:
        break;
    }
    if (questionType == QuestionTypes.Short) {
    }
    return new ShortQuestion("Nu am reusit sa selectam");
  };

  addQuestion = async () => {
    const { value: questionType } = await Swal.fire({
      icon: "question",
      title: "Which type of question do you want to add?",
      input: "select",
      inputOptions: {
        SHORT: "Short Answer",
        LONG: "Long Answer",
        MULTIPLE: "Multiple Options",
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

    console.log(newQuestion);
    if (!newQuestion) return;

    let question: QuestionPosition = {
      position: this.position + 1,
      question: newQuestion,
    };

    this.newQuestion.emit(question);
  };
}
