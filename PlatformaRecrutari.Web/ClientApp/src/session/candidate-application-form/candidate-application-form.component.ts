import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormDto } from "src/shared/dto/form-dto";
import { FormAnswer } from "src/shared/interfaces/form/answers/formAnswer";
import { QuestionAnswer } from "src/shared/interfaces/form/answers/questionAnswer";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { ParticipantsService } from "src/shared/services/participants.service";
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
  currentUser: UserInfo;
  currentUserHasAnswer: boolean;

  constructor(
    private participantsService: ParticipantsService,
    private authService: AuthenticationService,
    private sessionService: SessionService,
    private dtoMapper: DtoMapperService,
    private router: Router
  ) {}

  async ngOnInit() {
    let formDto: FormDto;
    this.sessionService.getActiveForm().subscribe(
      (res) => {
        formDto = res;
        this.formInfo = this.dtoMapper.mapFormDtoToFormInfo(formDto);
        this.participantsService
          .getParticipantAnswer(this.currentUser.id, formDto.id)
          .subscribe((res) => {
            if (res.length != 0) this.currentUserHasAnswer = true;
          });
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
    this.currentUser = await this.authService.getCurrentUser().toPromise();
  }

  updateAnswers = (newAnswers: Array<string>) => {
    this.formAnswer = newAnswers;
  };

  updateErrors = (position: number, hasError: boolean) => {
    this.formError[position] = hasError;
  };

  sendAnswers() {
    if (this.formError.includes(true)) {
      Swal.fire({
        title:
          "There are errors in the form!\nPlease complete all the questions correctly!",
        icon: "error",
      });
    } else {
      let newAnswers: FormAnswer = this.dtoMapper.mapToFormAnswer(
        this.formInfo,
        this.currentUser,
        this.formAnswer
      );

      Swal.fire({
        title: "Are you sure?\nOnce submitted the answers can't be edited!",
        icon: "info",
      }).then((answer) => {
        if (answer.value)
          this.participantsService.sendAnswers(newAnswers).subscribe(
            (res) => {
              Swal.fire({
                title: "Answer submitted succesfully!",
                icon: "success",
                timer: 2000,
              }).then((res) => {
                this.router.navigate(["/"]);
              });
            },
            (error) => {
              Swal.fire({
                title: "Something went wrong...\nPlease try again later!",
                icon: "error",
                timer: 2000,
              }).then((res) => {
                this.router.navigate(["/apply"]);
              });
            }
          );
      });
    }
  }
  navigateToCurrentUserProfile() {
    this.router.navigate([`/user/${this.currentUser.id}`]);
  }
}
