export interface SessionDto {
  id: number;
  creatorId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isOpen: boolean;
}
