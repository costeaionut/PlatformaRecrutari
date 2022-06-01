import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionDto } from "src/shared/dto/session/get-session-dto";
import { UserInfo } from "src/shared/interfaces/user/userInfo";
import { AuthenticationService } from "src/shared/services/authentication.service";
import { SessionService } from "src/shared/services/session.service";

@Component({
  selector: "app-session-manager",
  templateUrl: "./session-manager.component.html",
  styleUrls: ["./session-manager.component.css"],
})
export class SessionManagerComponent implements OnInit {
  displayActiveSessions: boolean;
  displayMySessions: boolean;
  displayPreviousSessions: boolean;

  activeSessions: Array<SessionInfo>;
  mySessions: Array<SessionInfo>;
  previousSessions: Array<SessionInfo>;

  currentUser: UserInfo;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private authService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.activeSessions = Array<SessionInfo>();
    this.previousSessions = Array<SessionInfo>();
    this.mySessions = Array<SessionInfo>();

    this.displayActiveSessions = true;
    this.displayMySessions = false;
    this.displayPreviousSessions = false;

    this.currentUser = await this.authService.getCurrentUser().toPromise();
    console.log(this.currentUser);

    this.sessionService.getAllSessions().subscribe((res) => {
      res.forEach((element) => {
        if (element.isOpen) this.activeSessions.push(element as SessionInfo);
        if (element.creatorId === this.currentUser.id)
          this.mySessions.push(element as SessionInfo);
        if (new Date(element.endDate).getTime() < Date.now())
          this.previousSessions.push(element);
      });
    });
  }

  goToActiveSessions() {
    this.displayActiveSessions = true;
    this.displayMySessions = false;
    this.displayPreviousSessions = false;
  }

  showSessions() {
    console.log(this.activeSessions);
    console.log(this.mySessions);
    console.log(this.previousSessions);
  }

  goToMySessions() {
    this.displayActiveSessions = false;
    this.displayMySessions = true;
    this.displayPreviousSessions = false;
  }

  goToPreviousSessions() {
    this.displayActiveSessions = false;
    this.displayMySessions = false;
    this.displayPreviousSessions = true;
  }

  goToCreateSessionPage() {
    this.router.navigate(["/create-session"]);
  }
}
