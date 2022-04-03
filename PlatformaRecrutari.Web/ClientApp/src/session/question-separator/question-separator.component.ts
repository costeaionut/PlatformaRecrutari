import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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

  addQuestion = async () => {
    const { value: questionType } = await Swal.fire({
      icon: "question",
      title: "Which type of question do you want to add?",
      input: "select",
      inputOptions: {
        short: "Short Answer",
        long: "Long Answer",
        multiple: "Multiple Options",
      },
      inputPlaceholder: "Question Type",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to chose something";
        }
      },
    });

    let question: QuestionPosition = {
      position: this.position + 1,
      question: questionType,
    };

    this.newQuestion.emit(question);
  };
}
