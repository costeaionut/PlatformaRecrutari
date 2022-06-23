import { Injectable } from "@angular/core";
import { GridMultipleOptions } from "../classes/questions/grid-multiple-options-question";
import { GridSelectBoxes } from "../classes/questions/grid-select-boxes-question";
import { MultipleQuestion } from "../classes/questions/multiple-question";
import { Question } from "../classes/questions/question";
import { SelectBoxesQuestion } from "../classes/questions/select-boxes-question";
import { ShortQuestion } from "../classes/questions/short-question";
import { CreateSessionDto } from "../dto/session/create-session-dto";
import { FormDto } from "../dto/form-dto";
import { GridMultipleQuestionDto } from "../dto/questions/grid-multiple-question";
import { GridSelectBoxesQuestionDto } from "../dto/questions/grid-select-boxes-question-dto";
import { MultipleQuestionDto } from "../dto/questions/multiple-question-dto";
import { SelectBoxesQuestionDto } from "../dto/questions/select-boxes-question-dto";
import { ShortQuestionDto } from "../dto/questions/short-question-dto";
import { FormInfo } from "../interfaces/form/formInfo";
import { QuestionPosition } from "../interfaces/session/question-position";
import { FormAnswer } from "../interfaces/form/answers/formAnswer";
import { UserInfo } from "../interfaces/user/userInfo";
import { QuestionAnswer } from "../interfaces/form/answers/questionAnswer";

@Injectable({
  providedIn: "root",
})
export class DtoMapperService {
  constructor() {}

  mapFormInfoToDto = (formInfo: FormInfo): FormDto => {
    let shortQuestionArray: Array<ShortQuestionDto> =
      new Array<ShortQuestionDto>();

    let multipleQuestionArray: Array<MultipleQuestionDto> =
      new Array<MultipleQuestionDto>();

    let selectBoxesQuestionArray: Array<SelectBoxesQuestionDto> =
      new Array<SelectBoxesQuestionDto>();

    let gridMultipleQuestionArray: Array<GridMultipleQuestionDto> =
      new Array<GridMultipleQuestionDto>();

    let gridSelectBoxesQuestionArray: Array<GridSelectBoxesQuestionDto> =
      new Array<GridSelectBoxesQuestionDto>();

    for (let index = 0; index < formInfo.questions.length; index++) {
      var currentElement = formInfo.questions[index];

      var currentQuestion = currentElement.question;
      var currentPosition = currentElement.position;

      switch (currentElement.question.getType()) {
        case "ShortQuestion":
          let shortQuestionDto: ShortQuestionDto = {
            id: currentQuestion.getId() ? currentQuestion.getId() : 0,
            question: (currentQuestion as ShortQuestion).getQuestion(),
            required: (currentQuestion as ShortQuestion).getRequired(),
            type: (currentQuestion as ShortQuestion).getType(),
            position: currentPosition,
          };
          shortQuestionArray.push(shortQuestionDto);
          break;

        case "MultipleQuestion":
          let multipleQuestion: MultipleQuestionDto = {
            id: currentQuestion.getId() ? currentQuestion.getId() : 0,
            question: (currentQuestion as MultipleQuestion).getQuestion(),
            type: (currentQuestion as MultipleQuestion).getType(),
            required: (currentQuestion as MultipleQuestion).getRequired(),
            options: (currentQuestion as MultipleQuestion).getOptions(),
            position: currentPosition,
          };
          multipleQuestionArray.push(multipleQuestion);
          break;

        case "SelectBoxesQuestion":
          let selectBoxesQuestion: SelectBoxesQuestionDto = {
            id: currentQuestion.getId() ? currentQuestion.getId() : 0,
            question: (currentQuestion as SelectBoxesQuestion).getQuestion(),
            type: (currentQuestion as SelectBoxesQuestion).getType(),
            required: (currentQuestion as SelectBoxesQuestion).getRequired(),
            options: (currentQuestion as SelectBoxesQuestion).getOptions(),
            position: currentPosition,
          };
          selectBoxesQuestionArray.push(selectBoxesQuestion);
          break;

        case "GridSelectQuestion":
          let gridSelectBoxesQuestion: GridSelectBoxesQuestionDto = {
            id: currentQuestion.getId() ? currentQuestion.getId() : 0,
            question: (currentQuestion as GridSelectBoxes).getQuestion(),
            type: (currentQuestion as GridSelectBoxes).getType(),
            required: (currentQuestion as GridSelectBoxes).getRequired(),
            oneAnswerPerColumn: (
              currentQuestion as GridSelectBoxes
            ).getOneAnswearPerColumn(),
            rows: (currentQuestion as GridSelectBoxes).getRows(),
            columns: (currentQuestion as GridSelectBoxes).getColumns(),
            position: currentPosition,
          };
          gridSelectBoxesQuestionArray.push(gridSelectBoxesQuestion);
          break;

        case "GridMultipleQuestion":
          let gridMultipleQuestion: GridMultipleQuestionDto = {
            id: currentQuestion.getId() ? currentQuestion.getId() : 0,
            question: (currentQuestion as GridMultipleOptions).getQuestion(),
            type: (currentQuestion as GridMultipleOptions).getType(),
            required: (currentQuestion as GridMultipleOptions).getRequired(),
            oneAnswerPerColumn: (
              currentQuestion as GridMultipleOptions
            ).getOneAnswearPerColumn(),
            rows: (currentQuestion as GridMultipleOptions).getRows(),
            columns: (currentQuestion as GridMultipleOptions).getColumns(),
            position: currentPosition,
          };
          gridMultipleQuestionArray.push(gridMultipleQuestion);
          break;
      }
    }

    let formDto: FormDto = {
      id: formInfo.id,
      title: formInfo.title,
      description: formInfo.description,
      startDate: new Date(formInfo.startDate.setHours(3, 0, 0)),
      endDate: new Date(formInfo.endDate.setHours(3, 0, 0)),
      shortQuestions: shortQuestionArray,
      multipleQuestions: multipleQuestionArray,
      selectBoxesQuestions: selectBoxesQuestionArray,
      gridMultipleQuestions: gridMultipleQuestionArray,
      gridSelectBoxesQuestions: gridSelectBoxesQuestionArray,
    };
    return formDto;
  };

  mapSessionInfoToDto = (
    sessionInfo: SessionInfo,
    formInfo: FormInfo
  ): CreateSessionDto => {
    let formDto: FormDto = this.mapFormInfoToDto(formInfo);

    let sessionDto: CreateSessionDto = {
      id: sessionInfo.id,
      creatorId: sessionInfo.creatorId,
      title: sessionInfo.title,
      startDate: new Date(sessionInfo.startDate.setHours(3, 0, 0)),
      endDate: new Date(sessionInfo.endDate.setHours(3, 0, 0)),
      isOpen: sessionInfo.isOpen,
      form: formDto,
      workshop: "notImplemented",
      interview: "notImplemented",
    };

    return sessionDto;
  };

  mapFormDtoToFormInfo = (formDto: FormDto): FormInfo => {
    let questions: Array<QuestionPosition> = new Array<QuestionPosition>();

    formDto.shortQuestions.forEach((element) => {
      let shortQuestion: ShortQuestion = new ShortQuestion(
        element.question,
        element.required
      );
      shortQuestion.setId(element.id);

      let newQuestionPosition: QuestionPosition = {
        question: shortQuestion,
        position: element.position,
      };

      questions.push(newQuestionPosition);
    });

    formDto.multipleQuestions.forEach((element) => {
      let multipleQuestion: MultipleQuestion = new MultipleQuestion(
        element.question,
        element.options,
        element.required
      );
      multipleQuestion.setId(element.id);

      let newQuestionPosition: QuestionPosition = {
        question: multipleQuestion,
        position: element.position,
      };

      questions.push(newQuestionPosition);
    });

    formDto.selectBoxesQuestions.forEach((element) => {
      let selectBox: SelectBoxesQuestion = new SelectBoxesQuestion(
        element.question,
        element.options,
        element.required
      );
      selectBox.setId(element.id);

      let newQuestionPosition: QuestionPosition = {
        question: selectBox,
        position: element.position,
      };

      questions.push(newQuestionPosition);
    });

    formDto.gridMultipleQuestions.forEach((element) => {
      let gridMultiple: GridMultipleOptions = new GridMultipleOptions(
        element.question,
        element.rows,
        element.columns,
        element.oneAnswerPerColumn,
        element.required
      );
      gridMultiple.setId(element.id);

      let newQuestionPosition: QuestionPosition = {
        question: gridMultiple,
        position: element.position,
      };

      questions.push(newQuestionPosition);
    });

    formDto.gridSelectBoxesQuestions.forEach((element) => {
      let gridSelect: GridSelectBoxes = new GridSelectBoxes(
        element.question,
        element.rows,
        element.columns,
        element.oneAnswerPerColumn,
        element.required
      );
      gridSelect.setId(element.id);

      let newQuestionPosition: QuestionPosition = {
        question: gridSelect,
        position: element.position,
      };

      questions.push(newQuestionPosition);
    });

    let sortedQuestions = questions.sort((q1, q2) => {
      if (q1.position < q2.position) return -1;
      if (q1.position > q2.position) return 1;
      return 0;
    });

    let formInfo: FormInfo = {
      id: formDto.id,
      title: formDto.title,
      description: formDto.description,
      startDate: new Date(formDto.startDate),
      endDate: new Date(formDto.endDate),
      questions: sortedQuestions,
    };
    return formInfo;
  };

  mapToFormAnswer(
    formInfo: FormInfo,
    submitterInfo: UserInfo,
    answers: string[]
  ): FormAnswer {
    let questionAnswers: QuestionAnswer[] = new Array<QuestionAnswer>();

    formInfo.questions.forEach((question) => {
      let newQuestionAnswer: QuestionAnswer = {
        questionId: question.question.getId(),
        answer: answers[question.position],
      };

      questionAnswers.push(newQuestionAnswer);
    });

    let formAnswer: FormAnswer = {
      formId: formInfo.id,
      candidateId: submitterInfo.id,
      answers: questionAnswers,
    };

    return formAnswer;
  }
}
