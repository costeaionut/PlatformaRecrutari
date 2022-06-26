import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { InterviewDto } from "src/shared/dto/interview/interviewDto";
import { InterviewInfo } from "src/shared/interfaces/interview/interview-info";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-interviews-manager",
  templateUrl: "./interviews-manager.component.html",
  styleUrls: ["./interviews-manager.component.css"],
})
export class InterviewsManagerComponent implements OnInit {
  @Input() session: SessionInfo;
  @Input() currentUser: UserInfo;

  interviews: Map<Date, Array<InterviewInfo>>;
  interviewsDates: Date[];

  selectedDate: Date;
  selectedDateIndex: number;
  selectedDateString: string;

  constructor(
    private modalService: NgbModal,
    private sessionService: SessionService
  ) {}

  async ngOnInit() {
    this.interviews = new Map<Date, Array<InterviewInfo>>();

    let interviewsDto: Array<InterviewDto> = await this.sessionService
      .getInterviewsBySessionId(this.session.id)
      .toPromise();

    interviewsDto.forEach((intDto) => {
      intDto.interviewsDetails.forEach((interviewDetail) => {
        interviewDetail.interviewDateTime = new Date(
          interviewDetail.interviewDateTime
        );
      });
      this.interviews.set(
        new Date(intDto.interviewsDate),
        intDto.interviewsDetails
      );
    });
    this.interviewsDates = Array.from(this.interviews.keys());

    this.selectedDate = this.interviewsDates[0];
    this.selectedDateString = this.selectedDate.toLocaleDateString();
    this.selectedDateIndex = 0;
  }

  changeDisplayCreate(newDisplay: string) {
    this.whatToDisplayCreate = newDisplay;
  }

  /**
   * Variables for single interview create
   */
  newInterviewDate: Date;
  whatToDisplayCreate: string;
  newInterviewDuration: number;
  displayInterviewDateTime: string;
  newInterviewBreakDuration: number;
  newSingleIntreviewErrors: string[];

  openCreateInterviewModal(content) {
    this.newInterviewDuration = 40;
    this.whatToDisplayCreate = "Single";
    this.newInterviewBreakDuration = 15;
    this.multipleInterviewDuration = 40;
    this.multipleInterviewBreakDuration = 15;

    this.newInterviewDate = undefined;
    this.displayInterviewDateTime = "";

    this.multipleInterviewEndDate = undefined;
    this.multipleInterviewStartDate = undefined;

    this.displyMultipleInterviewStartDate = "";
    this.displyMultipleInterviewEndDate = "";

    this.modalService.open(content, { centered: true, size: "lg" });
  }

  updateDateDisplay() {
    this.displayInterviewDateTime = `${this.newInterviewDate.toLocaleString()}`;
  }

  updateHour(newTime: Date) {
    this.newInterviewDate.setHours(newTime.getHours(), newTime.getMinutes());
    this.updateDateDisplay();
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  addMinutesToDate(date: Date, minutes: number): Date {
    return new Date(new Date(date).setMinutes(date.getMinutes() + minutes));
  }

  checkForErrorsSingleInterview() {
    this.newSingleIntreviewErrors = [];
    if (!this.newInterviewDate)
      this.newSingleIntreviewErrors.push(
        "Please select a date and a time for the interview!"
      );
    if (this.newInterviewDate < new Date())
      this.newSingleIntreviewErrors.push(
        "Date and time can't be smaller than today!"
      );
  }

  createNewSingleInterview(createInterviewModal) {
    this.checkForErrorsSingleInterview();
    if (this.newSingleIntreviewErrors.length != 0) return;

    let newInterview: InterviewInfo = {
      id: 0,
      sessionId: this.session.id,
      interviewDateTime: this.addHoursToDate(this.newInterviewDate, 3),
      duration: parseInt(this.newInterviewDuration.toString()),
      break: parseInt(this.newInterviewBreakDuration.toString()),
    };

    this.sessionService.postInterview(newInterview).subscribe(
      (_) => {
        Swal.fire({
          title: "Interview created successfully",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(async (_) => {
          await this.ngOnInit();
          createInterviewModal.close();
        });
      },
      (err) => {
        switch (err.error) {
          case "InterviewsOverlapping":
            Swal.fire({
              title:
                "Interviews are overlapping...\nPlease check existing interviews",
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
            });
            break;
        }
      }
    );
  }

  /**
   * Variables for multiple interview create
   */
  multipleInterviewEndDate: Date;
  multipleInterviewStartDate: Date;
  displyMultipleInterviewEndDate: string;
  displyMultipleInterviewStartDate: string;
  multipleInterviewDuration: number;
  multipleInterviewBreakDuration: number;
  multipleInterviewErrors: string[];

  updateStartDateDisplay() {
    this.displyMultipleInterviewStartDate = `${this.multipleInterviewStartDate.toLocaleString()}`;
  }

  updateStartHour(newTime: Date) {
    this.multipleInterviewStartDate.setHours(
      newTime.getHours(),
      newTime.getMinutes()
    );
    this.updateStartDateDisplay();
  }

  updateEndDateDisplay() {
    this.displyMultipleInterviewEndDate = `${this.multipleInterviewEndDate.toLocaleString()}`;
  }

  updateEndHour(newTime: Date) {
    this.multipleInterviewEndDate.setHours(
      newTime.getHours(),
      newTime.getMinutes()
    );
    this.updateEndDateDisplay();
  }

  checkForErrorsMultipleInterviews() {
    if (!this.multipleInterviewEndDate || !this.multipleInterviewStartDate)
      this.multipleInterviewErrors.push(
        "Please select a start date and an end date for generation"
      );
    if (this.multipleInterviewStartDate < new Date())
      this.multipleInterviewErrors.push(
        "Start date can't be set to earlier than now!"
      );

    if (this.multipleInterviewEndDate < this.multipleInterviewStartDate)
      this.multipleInterviewErrors.push(
        "Start date must be higher than end date!"
      );
  }

  generatedMultiplInterviews: InterviewInfo[];
  generateMultipleInterviews(reviewGeneratedModal) {
    this.multipleInterviewErrors = [];
    this.checkForErrorsMultipleInterviews();

    if (this.multipleInterviewErrors.length != 0) return;

    let startDate: Date = this.multipleInterviewStartDate;
    let endDate: Date = this.multipleInterviewEndDate;

    let localBreakTime: number = parseInt(
      this.multipleInterviewBreakDuration.toString()
    );
    let localDurationTime: number = parseInt(
      this.multipleInterviewDuration.toString()
    );

    let interviews: InterviewInfo[] = [];

    for (
      let curDate = startDate;
      curDate < endDate;
      curDate = this.addMinutesToDate(
        curDate,
        localBreakTime + localDurationTime
      )
    ) {
      let newInterview: InterviewInfo = {
        id: 0,
        break: localBreakTime,
        interviewDateTime: curDate,
        sessionId: this.session.id,
        duration: localDurationTime,
      };

      if (
        this.addMinutesToDate(
          newInterview.interviewDateTime,
          newInterview.break + newInterview.duration
        ) <= endDate
      ) {
        interviews.push(newInterview);
      }
    }
    this.generatedMultiplInterviews = interviews;
    this.modalService.open(reviewGeneratedModal, {
      centered: true,
      size: "lg",
      scrollable: true,
    });
  }

  createMultipleInterviews() {
    this.generatedMultiplInterviews.forEach((interview) => {
      interview.interviewDateTime = this.addHoursToDate(
        interview.interviewDateTime,
        3
      );
    });

    this.sessionService
      .postInterviewRange(this.generatedMultiplInterviews)
      .subscribe(
        (_) => {
          Swal.fire({
            title: "Interview created successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          }).then(async (_) => {
            await this.ngOnInit();
            this.modalService.dismissAll();
          });
        },
        (err) => {
          switch (err.error) {
            case "InterviewsOverlapping":
              Swal.fire({
                title:
                  "Interviews are overlapping...\nPlease check existing interviews",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
              }).then((_) => {
                this.generatedMultiplInterviews.forEach((interview) => {
                  interview.interviewDateTime = this.addHoursToDate(
                    interview.interviewDateTime,
                    -3
                  );
                });
              });
              break;
          }
        }
      );
  }

  updatedSelectedDateDisplay() {
    this.selectedDate = this.interviewsDates[this.selectedDateIndex];
    this.selectedDateString = this.selectedDate.toLocaleDateString();
  }

  changePage(step: number) {
    this.selectedDateIndex += step;
    this.updatedSelectedDateDisplay();
  }

  displayInterview: InterviewInfo;
  openInterviewInfoModal(displayInterviewModal, interview: InterviewInfo) {
    this.displayInterview = interview;

    this.modalService.open(displayInterviewModal, {
      centered: true,
      size: "lg",
    });
  }

  deleteOpenedInterview() {
    Swal.fire({
      title: "Are you sure you want to delete the interview?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: "green",
      confirmButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
    }).then((res) => {
      if (res.value)
        this.sessionService.deleteInterview(this.displayInterview).subscribe(
          (_) => {
            Swal.fire({
              title: "Workshop deleted successfully!",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            }).then(async (res) => {
              await this.ngOnInit();
              this.displayInterview = undefined;
              this.modalService.dismissAll();
            });
          },
          (err) => {
            Swal.fire({
              title:
                "There was an error deleting this interview...\nPlease try again",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
    });
  }
}
