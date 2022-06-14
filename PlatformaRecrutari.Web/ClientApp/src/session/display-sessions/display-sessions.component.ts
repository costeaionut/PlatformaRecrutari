import { getTreeNoValidDataSourceError } from "@angular/cdk/tree";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";
import { TypedRule } from "tslint/lib/rules";

@Component({
  selector: "app-display-sessions",
  templateUrl: "./display-sessions.component.html",
  styleUrls: ["./display-sessions.component.css"],
})
export class DisplaySessionsComponent implements OnInit {
  currentSession: SessionInfo;
  currentUser: UserInfo;
  creator: UserInfo;
  editing: boolean;
  invalid: boolean;

  constructor(
    private sessionService: SessionService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.editing = false;
    this.currentSession = await this.sessionService
      .getSessionById(id)
      .toPromise();

    this.creator = await this.authService
      .getUserById(this.currentSession.creatorId)
      .toPromise();

    this.currentUser = await this.authService.getCurrentUser().toPromise();
  }

  shouldShowActions() {
    if (this.creator.id === this.currentUser.id) return true;
    return false;
  }

  startDateErrors() {
    let currentDate = new Date().setHours(0, 0, 0, 0);
    let startDate = new Date(this.currentSession.startDate).getTime();
    let endDate = new Date(this.currentSession.endDate).getTime();

    if (endDate < startDate) {
      this.invalid = true;
      return "End date can't be earlier than start date!";
    }

    if (startDate < currentDate) {
      this.invalid = true;
      return "Start date can't be earlier than today!";
    }

    this.invalid = false;
    return null;
  }

  endDateErrors() {
    let startDate = new Date(this.currentSession.startDate).getTime();
    let endDate = new Date(this.currentSession.endDate).getTime();

    if (endDate < startDate) {
      this.invalid = true;
      return "End date can't be earlier than start date!";
    }

    this.invalid = false;
    return null;
  }

  edit() {
    Swal.fire({
      title: "Are you sure you want to edit this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) this.editing = true;
    });
  }

  async stopEditing() {
    await Swal.fire({
      title: "Finished editing?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.value) this.editing = false;
      this.currentSession.startDate = new Date(
        new Date(this.currentSession.startDate).setHours(3, 0, 0, 0)
      );
      this.currentSession.endDate = new Date(
        new Date(this.currentSession.endDate).setHours(3, 0, 0, 0)
      );
    });

    if (!this.editing) {
      this.sessionService.updateSessionInfo(this.currentSession).subscribe(
        (result) => {
          Swal.fire({
            title: "Session updated!",
            icon: "success",
            timer: 1000,
          });
        },
        (error) => {
          Swal.fire({
            title: "Something went wrong...",
            icon: "error",
            timer: 2000,
          });
        }
      );
    }
  }

  parseDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatus(): string {
    let castedStartDate = new Date(this.currentSession.startDate).setHours(
      0,
      0,
      0,
      0
    );
    let castedEndDate = new Date(this.currentSession.endDate).setHours(
      23,
      59,
      59,
      99
    );
    let currentDate = new Date().getTime();

    if (currentDate < castedStartDate) return "Upcoming";

    if (castedStartDate < currentDate && currentDate < castedEndDate)
      return "Active";

    if (castedEndDate < currentDate) return "Finished";
  }

  deleteSession() {
    Swal.fire({
      title: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.value) {
        this.sessionService
          .deleteSession(this.currentUser, this.currentSession.id)
          .subscribe(
            (res) => {
              Swal.fire({
                title: "Session deleted!",
                icon: "success",
                timer: 1500,
              }).then(() => {
                this.router.navigate(["/sessions"]);
              });
            },
            (error) => {
              Swal.fire({ icon: "error", title: "Something went wrong..." });
            }
          );
      }
    });
  }
}
