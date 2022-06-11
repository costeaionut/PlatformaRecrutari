import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
} from "@angular/core";

@Component({
  selector: "app-display-session-card",
  templateUrl: "./display-session-card.component.html",
  styleUrls: ["./display-session-card.component.css"],
})
export class DisplaySessionCardComponent implements OnInit {
  @Input() session: SessionInfo;
  @Input() parentSeeSessionInfoPage;

  constructor() {}

  ngOnInit() {}

  parseDate(date: Date): string {
    let stringDate = date.toString().split("T")[0];
    let dateArray = stringDate.split("-");
    return dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
  }

  getStatus(): string {
    let castedStartDate = new Date(this.session.startDate).setHours(0, 0, 0, 0);
    let castedEndDate = new Date(this.session.endDate).setHours(23, 59, 59, 99);
    let currentDate = new Date().getTime();

    if (currentDate < castedStartDate) return "Upcoming";

    if (castedStartDate < currentDate && currentDate < castedEndDate)
      return "Active";

    if (castedEndDate < currentDate) return "Finished";
  }
}
