import { configuration } from './../../configuration';
import { UtilityFun } from './../../shared/utility';
import { Post, PostService } from './../post-service.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isObservable } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  home = configuration.home;
  post: Post;
  shareUrl = '';
  decs = 'Checkout our latest poems and stories at our website. If you love it, Please share it.';
  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      // console.log(params['id']);
      const postObj = this.postService.getPost(params['id']);
      if (isObservable(postObj)) {
        postObj.subscribe((post) => {
          console.log(post);
          this.post = post as Post;
        });
      } else {
        this.post = postObj as Post;
      }
    });

  }

  minute_to_read(content: string, category?: string) {
    return UtilityFun.minute_to_read(content, category);
  }

  // getImgOwner(imgOwner: string) {
  //   return UtilityFun.getImgOwnerName(imgOwner);
  // }

}
