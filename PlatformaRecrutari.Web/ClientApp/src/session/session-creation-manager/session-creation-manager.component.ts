import { Component, OnInit } from "@angular/core";
import { CreateSessionDto } from "src/shared/dto/create-session-dto";
import { FormDto } from "src/shared/dto/form-dto";
import { FormInfo } from "src/shared/interfaces/form/formInfo";
import { DtoMapperService } from "src/shared/services/dto-mapper.service";
import { SessionService } from "src/shared/services/session.service";

@Component({
  selector: "app-session-creation-manager",
  templateUrl: "./session-creation-manager.component.html",
  styleUrls: ["./session-creation-manager.component.css"],
})
export class SessionCreationManagerComponent implements OnInit {
  currentStep: number;
  sessionInfo: SessionInfo;
  formInfo: FormInfo;

  constructor(
    private dtoMapper: DtoMapperService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.currentStep = 1;
    this.sessionInfo = {
      title: "",
      creatorId: "",
      startDate: new Date(),
      endDate: new Date(),
      isOpen: false,
    };

    this.formInfo = {
      title: "",
      description: "",
      questions: [],
    };
  }

  createSession = (): void => {
    let sessionInfoDto: CreateSessionDto = this.dtoMapper.mapSessionInfoToDto(
      this.sessionInfo,
      this.formInfo
    );

    this.sessionService.createSession(sessionInfoDto).subscribe(
      (res) => {},
      (error) => console.error(error)
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
