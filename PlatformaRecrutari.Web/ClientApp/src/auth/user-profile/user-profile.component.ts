import { getTreeNoValidDataSourceError } from "@angular/cdk/tree";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormDto } from "src/shared/dto/form-dto";
import { QuestionAnswer } from "src/shared/interfaces/form/answers/questionAnswer";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { ParticipantsService } from "src/shared/services/participants.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  currentUser: UserInfo;
  profileUser: UserInfo;

  activeSession: SessionInfo;
  activeForm: FormInfo;
  userAnswers: Array<string>;
  missingForm: boolean;

  display: string;

  constructor(
    private route: ActivatedRoute,
    private dtoMapper: DtoMapperService,
    private sessionService: SessionService,
    private authService: AuthenticationService,
    private participantsService: ParticipantsService
  ) {}

  async ngOnInit() {
    this.display = "UserInfo";
    const id: string = this.route.snapshot.paramMap.get("id");
    this.currentUser = await this.authService.getCurrentUser().toPromise();
    this.profileUser = await this.authService.getUserById(id).toPromise();

    this.activeSession = await this.sessionService
      .getActiveSession()
      .toPromise();

    let activeFormDto: FormDto = await this.sessionService
      .getSessionForm(this.activeSession.id)
      .toPromise();

    if (activeFormDto == null) {
      this.missingForm = true;
    } else {
      this.activeForm = this.dtoMapper.mapFormDtoToFormInfo(activeFormDto);
      let questionAnswer: Array<QuestionAnswer> = await this.participantsService
        .getParticipantAnswer(this.profileUser.id, this.activeForm.id)
        .toPromise();
      this.userAnswers = Array(this.activeForm.questions.length).fill("");

      questionAnswer.forEach((qa) => {
        let foundPlace: boolean;
        let questionIndex: number = 0;
        while (!foundPlace) {
          if (
            this.activeForm.questions[questionIndex].question.getId() ==
            qa.questionId
          ) {
            foundPlace = true;
            this.userAnswers[
              this.activeForm.questions[questionIndex].position
            ] = qa.answer;
          }
          questionIndex++;
        }
      });
    }
  }

  changeInfo() {
    Swal.fire({
      title: "Do you want to edit your info?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "No",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
    });
  }
  changePassword() {
    Swal.fire({
      title: "Do you want to change your password?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "No",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
    });
  }

  changeDisplay(newDisplay: string) {
    this.display = newDisplay;
  }
}
