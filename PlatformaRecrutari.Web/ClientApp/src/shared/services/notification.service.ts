import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();

  public sendLoginStateNotification(isAuthenticated) {
    this._authChangeSub.next(isAuthenticated);
  }
}
