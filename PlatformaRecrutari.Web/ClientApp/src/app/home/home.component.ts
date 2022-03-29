import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  public isUserAuthenticated: boolean;

  constructor(private _authService: AuthenticationService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this._authService._homeNotification.authChanged
      .subscribe(res => {
        this.isUserAuthenticated = res;
      })

    this._authService._homeNotification.sendLoginStateNotification(this._authService.isUserAuthenticated())

  }

  functionButton() {
    console.log(this.isUserAuthenticated)
  }
}
