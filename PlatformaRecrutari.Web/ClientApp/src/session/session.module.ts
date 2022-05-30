import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateSessionComponent } from "./create-session/create-session.component";
import { DisplaySessionComponent } from "./display-session/display-session.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { QuestionSeparatorComponent } from "./question-separator/question-separator.component";
import { ShortQuestionComponent } from "./question-components/short-question/short-question.component";

import { TextareaAutoresizeDirective } from "../shared/directives/textarea-autoresize.directive";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { QuestionTypeSelectorComponent } from "./question-type-selector/question-type-selector.component";
import { MultipleOptionsQuestionComponent } from "./question-components/multiple-options-question/multiple-options-question.component";
import { SelectBoxesQuestionComponent } from "./question-components/select-boxes-question/select-boxes-question.component";
@NgModule({
  declarations: [
    CreateSessionComponent,
    DisplaySessionComponent,
    SessionManagerComponent,
    CreateFormComponent,
    QuestionSeparatorComponent,
    ShortQuestionComponent,
    TextareaAutoresizeDirective,
    QuestionTypeSelectorComponent,
    MultipleOptionsQuestionComponent,
    SelectBoxesQuestionComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
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
