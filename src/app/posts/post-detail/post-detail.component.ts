import { configuration } from './../../configuration';
import { UtilityFun } from './../../shared/utility';
import { Post, PostService } from './../post-service.service';
import { Component, OnInit } from '@angular/core';
import { isObservable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SeoService } from 'src/app/seo.service';

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
  userId = null;

  decs = 'Checkout our latest poems and stories at our website. If you love it, Please share it.';

  constructor(private postService: PostService, private route: ActivatedRoute,
    private authService: AuthService, private router: Router, private seoService: SeoService) {
  }

  ngOnInit() {
    this.shareUrl = window.location.href;
    this.route.params.subscribe((params) => {
      // console.log(params['id']);
      const postObj = this.postService.getPost(params['id']);
      if (isObservable(postObj)) {
        postObj.subscribe((post) => {
          console.log(post);
          this.post = post as Post;
          if (this.userId === this.post.uid) { this.isLogin = true; }
          this.setMetaTags()
        }, (err) => {
          console.log(err);
          this.isError = true;
        });
      } else {
        this.post = postObj as Post;
        this.setMetaTags()
        if (this.userId === this.post.uid) { this.isLogin = true; }
      }
    });

    this.authService.userDetail.subscribe((user) => {
      if (user && user.id) {
        this.userId = user.id
      }
      if (this.post && this.userId === this.post.uid) {
        this.isLogin = true;
      }
    });
  }

  setMetaTags() {
    this.decs = UtilityFun.trimContent(this.post.content, 26);
    this.seoService.generateTags({
      title: this.post.title,
      image: this.post.imgPath,
      url: this.shareUrl,
      description: this.decs
    })
  }

  minute_to_read(content: string, category?: string) {
    return UtilityFun.minute_to_read(content, category);
  }

  // getImgOwner(imgOwner: string) {
  //   return UtilityFun.getImgOwnerName(imgOwner);
  // }

}
