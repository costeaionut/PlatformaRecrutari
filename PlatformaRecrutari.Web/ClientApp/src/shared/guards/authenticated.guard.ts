import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

  constructor(private router: Router) { }

  isExpired(token: string): boolean {

    let jwtData = token.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData)

    if (decodedJwtData.exp <= Date.now() / 1000)
      return true

    return false
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    var jwt = localStorage.getItem("token");

    if (jwt === null || this.isExpired(jwt)) {
      this.router.navigate(['/login-user'])
      return false;
    }

    return true;
  }
  
}
