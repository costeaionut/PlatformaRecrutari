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

  constructor(
    private sessionService: SessionService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
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

  deleteSession() {
    Swal.fire({
      title: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
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
