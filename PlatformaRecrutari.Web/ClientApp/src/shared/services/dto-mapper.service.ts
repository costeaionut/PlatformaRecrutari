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

@Injectable({
  providedIn: "root",
})
export class DtoMapperService {
  constructor() {}

  mapSessionInfoToDto = (
    sessionInfo: SessionInfo,
    formInfo: FormInfo
  ): CreateSessionDto => {
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
            question: (currentQuestion as ShortQuestion).getQuestion(),
            required: (currentQuestion as ShortQuestion).getRequired(),
            type: (currentQuestion as ShortQuestion).getType(),
            position: currentPosition,
          };
          shortQuestionArray.push(shortQuestionDto);
          break;

        case "MultipleQuestion":
          let multipleQuestion: MultipleQuestionDto = {
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
          gridSelectBoxesQuestionArray.push(gridMultipleQuestion);
          break;
      }
    }

    let formDto: FormDto = {
      id: 0,
      title: formInfo.title,
      description: formInfo.description,
      shortQuestions: shortQuestionArray,
      multipleQuestions: multipleQuestionArray,
      selectBoxesQuestions: selectBoxesQuestionArray,
      gridMultipleQuestions: gridMultipleQuestionArray,
      gridSelectBoxesQuestions: gridSelectBoxesQuestionArray,
    };

    let sessionDto: CreateSessionDto = {
      id: sessionInfo.id,
      creatorId: sessionInfo.creatorId,
      title: sessionInfo.title,
      startDate: sessionInfo.startDate,
      endDate: sessionInfo.endDate,
      isOpen: sessionInfo.isOpen,
      form: formDto,
      workshop: "notImplemented",
      interview: "notImplemented",
    };

    return sessionDto;
  };
}
