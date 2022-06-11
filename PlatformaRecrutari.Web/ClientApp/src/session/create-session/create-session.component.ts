import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "src/shared/services/authentication.service";

@Component({
  selector: "app-create-session",
  templateUrl: "./create-session.component.html",
  styleUrls: ["./create-session.component.css"],
})
export class CreateSessionComponent implements OnInit {
  @Input() sessionInfo: SessionInfo;
  @Input() parentChangePage;
  @Output() sessionInfoEmitter = new EventEmitter<SessionInfo>();

  public sessionForm: FormGroup;
  public showError: Boolean;
  public errorMessage: string = "";
  public submittingForm: Boolean;
  public validDates: Boolean = true;

  constructor(private _authService: AuthenticationService) {}

  ngOnInit() {
    if (this.sessionInfo.creatorId === "") {
      this.sessionForm = new FormGroup({
        title: new FormControl("", [Validators.required]),
        startDate: new FormControl("", [Validators.required]),
        endDate: new FormControl("", [Validators.required]),
      });
    } else {
      this.sessionForm = new FormGroup({
        title: new FormControl(this.sessionInfo.title, [Validators.required]),
        startDate: new FormControl(this.sessionInfo.startDate, [
          Validators.required,
        ]),
        endDate: new FormControl(this.sessionInfo.endDate, [
          Validators.required,
        ]),
      });
    }
  }

  public validateControl(controlName: string) {
    return (
      this.sessionForm.controls[controlName].invalid &&
      this.sessionForm.controls[controlName].touched
    );
  }

  public hasError(controlName: string, errorName: string) {
    return this.sessionForm.controls[controlName].hasError(errorName);
  }

  areDatesValid = (startDate: Date, endDate: Date): boolean => {
    return startDate < endDate && startDate < new Date();
  };

  public async changePage(formValue: any) {
    const result = await this._authService.getCurrentUser().toPromise();
    this.validDates = true;

    if (!this.areDatesValid(formValue.startDate, formValue.endDate)) {
      this.validDates = false;
      return;
    }

    this.sessionInfo.creatorId = result.id;
    this.sessionInfo.title = formValue.title;
    this.sessionInfo.startDate = formValue.startDate;
    this.sessionInfo.endDate = formValue.endDate;
    this.sessionInfo.isOpen = false;

    this.sessionInfoEmitter.emit(this.sessionInfo);
    this.parentChangePage(1);
  }
}
