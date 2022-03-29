import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSessionComponent } from './create-session/create-session.component';
import { DisplaySessionComponent } from './display-session/display-session.component';



@NgModule({
  declarations: [CreateSessionComponent, DisplaySessionComponent],
  imports: [
    CommonModule
  ],
  exports: [CreateSessionComponent, DisplaySessionComponent]
})
export class SessionModule { }
