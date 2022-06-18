import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateSessionComponent } from "./create-session/create-session.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SessionCreationManagerComponent } from "./session-creation-manager/session-creation-manager.component";
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatInputModule,
  MatRadioGroup,
  MatRadioButton,
  MatRippleModule,
  MatButtonModule,
  MatRadioModule,
  MatCheckboxModule,
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
import { GridMultipleOptionsQuestionComponent } from "./question-components/grid-multiple-options-question/grid-multiple-options-question.component";
import { GridSelectBoxesQuestionComponent } from "./question-components/grid-select-boxes-question/grid-select-boxes-question.component";
import { DisplayFormComponent } from "./display-form/display-form.component";
import { SessionManagerComponent } from "./session-manager/session-manager.component";
import { DisplaySessionsComponent } from "./display-sessions/display-sessions.component";
import { DisplaySessionCardComponent } from "./display-session-card/display-session-card.component";
import { SessionCreationReviewComponent } from "./session-creation-review/session-creation-review.component";
import { ShortQuestionDisplayComponent } from "./display-form-quesitons/short-question-display/short-question-display.component";
import { MultipleQuestionDisplayComponent } from "./display-form-quesitons/multiple-question-display/multiple-question-display.component";
import { SelectBoxQuestionDisplayComponent } from "./display-form-quesitons/select-box-question-display/select-box-question-display.component";
import { GridMultipleQuestionDisplayComponent } from "./display-form-quesitons/grid-multiple-question-display/grid-multiple-question-display.component";
import { GridSelectBoxQuestionDisplayComponent } from "./display-form-quesitons/grid-select-box-question-display/grid-select-box-question-display.component";
@NgModule({
  declarations: [
    CreateSessionComponent,
    SessionCreationManagerComponent,
    CreateFormComponent,
    QuestionSeparatorComponent,
    ShortQuestionComponent,
    TextareaAutoresizeDirective,
    QuestionTypeSelectorComponent,
    MultipleOptionsQuestionComponent,
    SelectBoxesQuestionComponent,
    GridMultipleOptionsQuestionComponent,
    GridSelectBoxesQuestionComponent,
    DisplayFormComponent,
    SessionManagerComponent,
    DisplaySessionsComponent,
    DisplaySessionCardComponent,
    SessionCreationReviewComponent,
    ShortQuestionDisplayComponent,
    MultipleQuestionDisplayComponent,
    SelectBoxQuestionDisplayComponent,
    GridMultipleQuestionDisplayComponent,
    GridSelectBoxQuestionDisplayComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatRadioModule,
    MatRippleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(),
  ],
  exports: [
    DisplaySessionsComponent,
    SessionManagerComponent,
    SessionCreationManagerComponent,
  ],
})
export class SessionModule {}
