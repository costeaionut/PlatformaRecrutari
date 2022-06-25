import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { UserInfo } from "../../shared/interfaces/user/userInfo";
import { AuthenticationService } from "../../shared/services/authentication.service";

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.css"],
})
export class NavMenuComponent implements OnInit, OnChanges {
  public isUserAuthenticated: boolean;
  user: UserInfo;
  isExpanded = false;

  constructor(private _authService: AuthenticationService) {}
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error("Method not implemented.");
  }

  async ngOnInit() {
    await this._authService._navBarNotification.authChanged.subscribe((res) => {
      this.isUserAuthenticated = res;

      if (this.isUserAuthenticated) {
        this._authService.getCurrentUser().subscribe(
          (user) => {
            this.user = user;
          },
          (err) => console.error(err)
        );
      }
    });

    await this._authService._navBarNotification.sendLoginStateNotification(
      this._authService.isUserAuthenticated()
    );
  }

  isUserPM() {
    if (this.isUserAuthenticated)
      if (this.user.role == "ProjectManager") return true;
    return false;
  }

  isUserNotCandidate() {
    if (this.isUserAuthenticated) {
      if (this.user.role == "Candidate") return false;
      return true;
    } else {
      return false;
    }
  }

  isUserCandidate() {
    if (this.isUserAuthenticated)
      if (this.user.role == "Candidate") return true;
    return false;
  }

  functionButton() {
    console.log(this.isUserAuthenticated);
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this._authService.logoutUser();
  }
}
