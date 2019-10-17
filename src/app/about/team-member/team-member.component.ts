import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-team-member',
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMemberComponent implements OnInit {

  @Input() author: { name: string, social: string, img: string, profession: string };
  constructor() { }

  ngOnInit() {
    // console.log(this.author);
  }

}
