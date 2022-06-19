import { Component, OnInit } from "@angular/core";
import { FormDto } from "src/shared/dto/form-dto";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-candidate-application-form",
  templateUrl: "./candidate-application-form.component.html",
  styleUrls: ["./candidate-application-form.component.css"],
})
export class CandidateApplicationFormComponent implements OnInit {
  formInfo: FormInfo;
  formAnswer: Array<string>;
  formError: Array<boolean>;
  formStatus: string;

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
        this.formError = new Array<boolean>();
        this.formInfo.questions.forEach((question) => {
          this.formError.push(question.question.getRequired());
        });
      },
      (error) => {
        if (error.error == "NoActiveSession")
          this.formStatus = "There is no active session at this moment!";
        else {
          let errorMessage: string = error.error.split("||")[0];
          switch (errorMessage) {
            case "UpcomingForm":
              let openingDate: string = error.error
                .split("||")[1]
                .split(" ")[0];
              this.formStatus = `The form is not yet active. The form will open on ${openingDate}`;
              break;
            case "ClosedForm":
              let endDate: string = error.error.split("||")[1].split(" ")[0];
              this.formStatus =
                `The form has stopped accepting answers!` +
                `It has closed on ${endDate} at 23:59`;
              break;
          }
        }
      }
    );
  }

  updateAnswers = (newAnswers: Array<string>) => {
    this.formAnswer = newAnswers;
  };

  updateErrors = (position: number, hasError: boolean) => {
    this.formError[position] = hasError;
  };

  showAnswers() {
    if (this.formError.includes(true)) {
      Swal.fire({
        title:
          "There are errors in the form!\nPlease complete all the questions correctly!",
        icon: "error",
      });
      console.log(this.formError);
    } else console.log(this.formAnswer);
  }
}
