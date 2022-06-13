import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { SessionService } from "src/shared/services/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-session-manager",
  templateUrl: "./session-manager.component.html",
  styleUrls: ["./session-manager.component.css"],
})
export class SessionManagerComponent implements OnInit {
  displayCurrentSession: boolean;
  displayPreviousSessions: boolean;

  currentSession: Array<SessionInfo>;
  previousSessions: Array<SessionInfo>;

  currentUser: UserInfo;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private authService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.currentSession = Array<SessionInfo>();
    this.previousSessions = Array<SessionInfo>();

    this.displayCurrentSession = true;
    this.displayPreviousSessions = false;

    this.currentUser = await this.authService.getCurrentUser().toPromise();

    this.sessionService.getAllSessions().subscribe((res) => {
      res.forEach((element) => {
        if (element.creatorId == this.currentUser.id)
          this.currentSession.push(element as SessionInfo);
        if (new Date(element.endDate).setHours(23, 59, 59, 99) < Date.now())
          this.previousSessions.push(element as SessionInfo);
      });
    });
  }

  goToSessionInfo = (id: number) => {
    this.router.navigate(["/session/" + id]);
  };

  goToCurrentSession() {
    this.displayCurrentSession = true;
    this.displayPreviousSessions = false;
  }

  goToPreviousSessions() {
    this.displayCurrentSession = false;
    this.displayPreviousSessions = true;
  }

  goToCreateSessionPage() {
    if (this.currentSession.length != 0) {
      Swal.fire({
        title:
          "You have already created a session! Please delete it and try again!",
        icon: "error",
      });
    } else this.router.navigate(["/create-session"]);
  }
}
