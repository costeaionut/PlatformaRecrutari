import { Component, OnInit } from "@angular/core";
import { FormDto } from "src/shared/dto/form-dto";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { SessionService } from "src/shared/services/session.service";

@Component({
  selector: "app-candidate-application-form",
  templateUrl: "./candidate-application-form.component.html",
  styleUrls: ["./candidate-application-form.component.css"],
})
export class CandidateApplicationFormComponent implements OnInit {
  formInfo: FormInfo;
  formAnswer: Array<string>;

  constructor(
    private sessionService: SessionService,
    private dtoMapper: DtoMapperService
  ) {}

  ngOnInit() {
    let formDto: FormDto;
    this.sessionService.getActiveForm().subscribe(
      (res) => {
        formDto = res;
        this.formInfo = this.dtoMapper.mapFormDtoToFormInfo(formDto);
        this.formAnswer = Array(this.formInfo.questions.length).fill("");
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  updateAnswers = (newAnswers: Array<string>) => {
    this.formAnswer = newAnswers;
  };

  showAnswers() {
    console.log(this.formAnswer);
  }
}
