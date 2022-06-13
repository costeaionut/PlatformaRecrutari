import { Component, OnInit } from "@angular/core";
import { CreateSessionDto } from "src/shared/dto/session/create-session-dto";
import { FormDto } from "src/shared/dto/form-dto";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-session-creation-manager",
  templateUrl: "./session-creation-manager.component.html",
  styleUrls: ["./session-creation-manager.component.css"],
})
export class SessionCreationManagerComponent implements OnInit {
  currentStep: number;
  sessionInfo: SessionInfo;
  formInfo: FormInfo;
  submitting: boolean;

  constructor(
    private dtoMapper: DtoMapperService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentStep = 1;
    this.sessionInfo = {
      id: 0,
      title: "",
      creatorId: "",
      startDate: new Date(),
      endDate: new Date(),
      isOpen: false,
    };

    this.formInfo = {
      id: 0,
      title: "",
      description: "",
      questions: [],
      startDate: new Date(),
      endDate: new Date(),
    };

    this.submitting = false;
  }

  createSession = (): void => {
    this.submitting = true;
    let sessionInfoDto: CreateSessionDto = this.dtoMapper.mapSessionInfoToDto(
      this.sessionInfo,
      this.formInfo
    );
    this.sessionService.createSession(sessionInfoDto).subscribe(
      (res) => {
        Swal.fire({
          title: "Form created successfully!",
          icon: "success",
          timer: 1500,
        }).then(() => {
          this.router.navigate(["/sessions"]);
          this.submitting = false;
        });
      },
      (error) => {
        console.log(error.error);
        if (error.error === "This user has already created a session.") {
          Swal.fire({
            title:
              "You have already created a session! Please delete the existing one and try again!",
            icon: "error",
          }).then(() => {
            this.router.navigate(["/sessions"]);
            this.submitting = false;
          });
        } else {
          Swal.fire({
            title: "There has been an error! Please try again later.",
            icon: "error",
            timer: 1500,
          });
          this.submitting = false;
        }
      }
    );
  };

  changePage = (page: number): void => {
    if (
      (page === 1 && this.currentStep !== 3) ||
      (page === -1 && this.currentStep !== 1)
    ) {
      this.currentStep += page;
    }
  };

  updateSession = (newValues: SessionInfo): void => {
    this.sessionInfo = newValues;
  };

  updateFormInfo = (newFormInfo: FormInfo): void => {
    this.formInfo = newFormInfo;
  };
}
