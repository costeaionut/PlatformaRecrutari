import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-question-type-selector",
  templateUrl: "./question-type-selector.component.html",
  styleUrls: ["./question-type-selector.component.css"],
})
export class QuestionTypeSelectorComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() questionType: String;
  @Output() updateType = new EventEmitter<String>();

  constructor() {}

  updateQuestionType() {
    this.updateType.emit(this.questionType);
  }

  ngOnInit() {}
}
