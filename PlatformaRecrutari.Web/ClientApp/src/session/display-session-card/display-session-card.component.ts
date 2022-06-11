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

  parseStatus(status: boolean): string {
    if (status) return "Active";
    return "Closed";
  }
}
