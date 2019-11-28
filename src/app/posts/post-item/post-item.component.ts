import { configuration } from './../../configuration';
import { UtilityFun } from './../../shared/utility';
import { Post } from './../post-service.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  home = configuration.home;
  @Input() post: Post;
  @Input() isDraft: boolean;
  route = ""
  queryParams: {};

  constructor() { }

  ngOnInit() {
    if (this.isDraft === false || this.isDraft) {
      this.queryParams = { "isDraft": this.isDraft }
      this.route = "/posts/"+this.post.id + "/edit"

    } else {
      this.route = "/posts/"+this.post.id;
    }

  }

  time_to_read(content: string, category?: string) {
    return UtilityFun.minute_to_read(content, category);
  }

}
