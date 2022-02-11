import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  public isUserAuthenticated: boolean;

  constructor(private _authService: AuthenticationService, private http: HttpClient) { }

  ngOnInit(): void {
    this.isUserAuthenticated = this._authService.isUserAuthenticated();
  }

  functionButton() {
    this.http.get("https://localhost:44301/api/Admin/ListUsers").subscribe(res => {
      console.log(res)
    }, err => console.error(err))
  }
}
