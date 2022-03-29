import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-display-session',
  templateUrl: './display-session.component.html',
  styleUrls: ['./display-session.component.css']
})
export class DisplaySessionComponent implements OnInit {

  sessionId: string

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id']
    })
  }

}
