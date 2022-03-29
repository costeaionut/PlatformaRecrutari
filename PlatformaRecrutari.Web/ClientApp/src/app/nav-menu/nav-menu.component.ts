import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../../shared/interfaces/user/userInfo';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent implements OnInit {

  public isUserAuthenticated: boolean;
  user: UserInfo
  isExpanded = false;

  constructor(private _authService: AuthenticationService) {
  }

  async ngOnInit() {
    await this._authService._navBarNotification.authChanged
      .subscribe(res => {
        this.isUserAuthenticated = res;
      })

    await this._authService._navBarNotification.sendLoginStateNotification(this._authService.isUserAuthenticated())

    if (this.isUserAuthenticated) {
      await this._authService.getCurrentUser().subscribe(user => {
        this.user = user
      }, err => console.error(err))
    }
  }

  isUserPM() {
    if (this.isUserAuthenticated) 
      if (this.user.role == 'ProjectManager')
        return true
    return false
  }

  functionButton() {
    console.log(this.isUserAuthenticated)
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
