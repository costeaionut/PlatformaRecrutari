import { FormDto } from "../form-dto";

export interface CreateSessionDto {
  id: number;
  creatorId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  isOpen: boolean;
  form: FormDto;
  workshop: string;
  interview: string;
}
