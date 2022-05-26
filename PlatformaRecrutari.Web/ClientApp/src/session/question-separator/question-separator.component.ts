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
    return new ShortQuestion("Intrebarea ta? :)");
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
