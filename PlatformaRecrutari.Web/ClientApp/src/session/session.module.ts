import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateSessionComponent } from "./create-session/create-session.component";
import { DisplaySessionComponent } from "./display-session/display-session.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SessionManagerComponent } from "./session-manager/session-manager.component";
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
} from "@angular/material";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CreateFormComponent } from "./create-form/create-form.component";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { QuestionSeparatorComponent } from './question-separator/question-separator.component';

@NgModule({
  declarations: [
    CreateSessionComponent,
    DisplaySessionComponent,
    SessionManagerComponent,
    CreateFormComponent,
    QuestionSeparatorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(),
  ],
  exports: [
    CreateSessionComponent,
    DisplaySessionComponent,
    SessionManagerComponent,
  ],
})
export class SessionModule {}
