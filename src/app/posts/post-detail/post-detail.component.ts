import { configuration } from './../../configuration';
import { UtilityFun } from './../../shared/utility';
import { Post, PostService } from './../post-service.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isObservable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { post } from 'selenium-webdriver/http';
import { isLong } from 'long';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  home = configuration.home;
  post: Post;
  shareUrl = '';
  isError = false;
  isLogin = false;
  decs = 'Checkout our latest poems and stories at our website. If you love it, Please share it.';
  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.shareUrl = window.location.href;
    this.route.params.subscribe((params) => {
      // console.log(params['id']);
      const postObj = this.postService.getPost(params['id']);
      if (isObservable(postObj)) {
        postObj.subscribe((post) => {
          console.log(post);
          this.post = post as Post;
        }, (err) => {
          console.log(err);
          this.isError = true;
        });
      } else {
        this.post = postObj as Post;
      }
    });

    this.authService.userDetail.subscribe((user) => {
      if (!user || user.id !== this.post.uid) {
        this.isLogin = false;
      } else {
        this.isLogin = true;
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
