import { Question } from "./question";

export class GridSelectBoxes extends Question {
  private question: string;
  private rows: Array<string>;
  private columns: Array<string>;
  private oneAnswearPerColumn: boolean;

  constructor(
    _question: string,
    _rows: Array<string>,
    _columns: Array<string>,
    _oneAnswearPerColumn: boolean,
    _required?: boolean
  ) {
    super("GridSelectQuestion", _required);
    this.question = _question;
    this.rows = _rows;
    this.columns = _columns;
    this.oneAnswearPerColumn = _oneAnswearPerColumn;
  }

  public setId = (_id: number) => super.setId(_id);
  public getId = () => super.getId();

  public setQuestion = (_question: string): void => {
    this.question = _question;
  };
  public getQuestion = (): string => {
    return this.question;
  };

  public setRows = (_rows: Array<string>): void => {
    this.rows = _rows;
  };
  public getRows = (): Array<string> => {
    return this.rows;
  };
  public setColumns = (_columns: Array<string>): void => {
    this.columns = _columns;
  };
  public getColumns = (): Array<string> => {
    return this.columns;
  };

  public setOneAnswearPerColumn = (_oneAnswearPerColumn: boolean): void => {
    this.oneAnswearPerColumn = _oneAnswearPerColumn;
  };
  public getOneAnswearPerColumn = (): boolean => {
    return this.oneAnswearPerColumn;
  };
}
