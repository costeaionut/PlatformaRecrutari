import { Component, Input, OnInit, Output } from "@angular/core";
import { FormInfo } from "src/shared/interfaces/form/formInfo";

@Component({
  selector: "app-display-form",
  templateUrl: "./display-form.component.html",
  styleUrls: ["./display-form.component.css"],
})
export class DisplayFormComponent implements OnInit {
  @Input() formInfo: FormInfo;

  constructor() {}

  ngOnInit() {}
}
