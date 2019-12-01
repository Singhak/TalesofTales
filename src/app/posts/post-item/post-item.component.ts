import { configuration } from './../../configuration';
import { UtilityFun } from './../../shared/utility';
import { Post } from './../post-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { post } from 'selenium-webdriver/http';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  home = configuration.home;
  @Input() post: Post;
  @Input() isDraft: boolean;
  @Input() uid: string;
  route = ""
  queryParams: {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.isDraft === false || this.isDraft) {
      this.queryParams = { "isDraft": this.isDraft }
      this.route = "/posts/" + this.post.id + "/edit"

    } else {
      this.route = "/posts/" + this.post.id;
    }

    if (this.uid !== this.post.uid) {
      this.queryParams = {};
      this.route = "/posts/" + this.post.id;
      this.isDraft = undefined;
    }

  }

  time_to_read(content: string, category?: string) {
    return UtilityFun.minute_to_read(content, category);
  }

}
