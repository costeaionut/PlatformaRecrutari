import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { UserInfo } from "../interfaces/user/userInfo";
import { AuthenticationService } from "../services/authentication.service";
import { AuthenticatedGuard } from "./authenticated.guard";

@Injectable({
  providedIn: "root",
})
export class HomeRedirectGuard implements CanActivate {
  constructor(
    private router: Router,
    private authGuard: AuthenticatedGuard,
    private authService: AuthenticationService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authGuard.canActivate(next, state) == false) {
      this.router.navigate(["/login-user"]);
      return false;
    }

    this.authService.getCurrentUser().subscribe((user) => {
      if (user.role == "Candidate") {
        this.router.navigate(["user", user.id]);
        return false;
      }
      if (
        user.role == "ProjectManager" ||
        user.role == "Volunteer" ||
        user.role == "BoardMember" ||
        user.role == "DepartmentDirector"
      ) {
        this.router.navigate(["sessions"]);
        return false;
      }
      if (user.role == "Admin") {
        this.router.navigate(["admin-dashboard"]);
        return false;
      }
    });
  }
}
