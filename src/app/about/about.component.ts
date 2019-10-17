import { Component, OnInit } from '@angular/core';
import { configuration } from '../configuration';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  about = configuration.aboutus;
  constructor() { }

  ngOnInit() {
  }

}
