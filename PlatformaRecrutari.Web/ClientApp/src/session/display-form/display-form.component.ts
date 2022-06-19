import { Component, Input, OnInit, Output } from "@angular/core";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { AnswerPosition } from "src/shared/interfaces/session/answer-position";
import { ErrorPosition } from "src/shared/interfaces/session/error-position";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { SessionService } from "src/shared/services/session.service";

@Component({
  selector: "app-display-form",
  templateUrl: "./display-form.component.html",
  styleUrls: ["./display-form.component.css"],
})
export class DisplayFormComponent implements OnInit {
  @Input() formInfo: FormInfo;
  @Input() sessionId: number;
  @Input() canAnswer: boolean;

  @Input() parentUpdateAnswers;
  @Input() parentUpdateErrors;
  @Input() answers: Array<string>;

  constructor(
    private sessionManager: SessionService,
    private dtoMapper: DtoMapperService
  ) {}

  async ngOnInit() {
    if (this.sessionId) {
      let formDto = await this.sessionManager
        .getSessionForm(this.sessionId)
        .toPromise();

      this.formInfo = this.dtoMapper.mapFormDtoToFormInfo(formDto);
    }
  }

  updateErrors(newErrorStatus: ErrorPosition) {
    this.parentUpdateErrors(newErrorStatus.position, newErrorStatus.hasError);
  }

  updateAnswer(newAnswer: AnswerPosition) {
    this.answers[newAnswer.position] = newAnswer.answer;
    this.parentUpdateAnswers(this.answers);
  }
}
