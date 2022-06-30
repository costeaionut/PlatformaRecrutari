import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticatedGuard } from "./authenticated.guard";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authGuard: AuthenticatedGuard) {}

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

    const jwt = localStorage.getItem("token");

    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    if (
      decodedJwtData[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] != "Admin" ||
      decodedJwtData.exp <= Date.now() / 1000
    ) {
      this.router.navigate(["/"]);
      return false;
    }

    return true;
  }
}
