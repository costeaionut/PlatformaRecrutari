import { Question } from "./question";

export class GridMultipleOptions extends Question {
  private question: String;
  private rows: Array<String>;
  private columns: Array<String>;
  private oneAnswearPerColumn: boolean;

  constructor(
    _question: String,
    _rows: Array<String>,
    _columns: Array<String>,
    _oneAnswearPerColumn: boolean,
    _required?: boolean
  ) {
    super("GridMultipleQuestion", _required);
    this.question = _question;
    this.rows = _rows;
    this.columns = _columns;
    this.oneAnswearPerColumn = _oneAnswearPerColumn;
  }

  public setQuestion = (_question: String): void => {
    this.question = _question;
  };
  public getQuestion = (): String => {
    return this.question;
  };

  public setRows = (_rows: Array<String>): void => {
    this.rows = _rows;
  };
  public getRows = (): Array<String> => {
    return this.rows;
  };
  public setColumns = (_columns: Array<String>): void => {
    this.columns = _columns;
  };
  public getColumns = (): Array<String> => {
    return this.columns;
  };

  public setOneAnswearPerColumn = (_oneAnswearPerColumn: boolean): void => {
    this.oneAnswearPerColumn = _oneAnswearPerColumn;
  };
  public getOneAnswearPerColumn = (): boolean => {
    return this.oneAnswearPerColumn;
  };
}
