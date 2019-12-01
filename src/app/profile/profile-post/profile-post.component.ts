import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/posts/post-service.service';
import { ActivatedRoute } from '@angular/router';
import { post } from 'selenium-webdriver/http';
import { UtilityFun } from 'src/app/shared/utility';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile-post',
  template: `
  <section class="blog-list px-3 py-5 p-md-5">
  <div class="container" style="text-align: center">
      <app-loading *ngIf="loading"></app-loading>
      <div class="item mb-5" *ngFor="let post of posts">
          <app-post-item [post]="post" [isDraft]="isDraft" [uid]="uid"></app-post-item>
      </div>
  </div>
  <div *ngIf="!posts.length && !loading">
  <div style="text-align: center;"><strong>{{msg}}</strong></div>
  </div>
</section>
  `,
  styles: []
})
export class ProfilePostComponent implements OnInit {

  id: string;
  uid: string;
  posts: any = [];
  isDraft: boolean;
  loading = false;
  msg = "";
  constructor(private postService: PostService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.id = this.route.parent.params['value']['id'];
    this.route.params.subscribe((param) => {
      this.posts = [];
      const type = param['type'];
      if (type === 'draft') {
        this.getPosts(this.id, 'modposts');
      } else if (type === 'posts') {
        this.getPosts(this.id, 'Posts');
      }
    });

    this.authService.userDetail.subscribe((user) => {
      if (user) {
        this.uid = user.id;
      }
    })


  }

  getPosts(id: string, collection: string, ) {
    this.loading = true;
    this.postService.getPostOfUser(id, collection).subscribe((post) => {
      this.loading = false;
      this.posts = post;
      if (collection === 'Posts') {
        this.isDraft = false;
      } else if (collection === 'modposts') {
        this.isDraft = true;
      }
    }, (err) => {
      this.loading = false;
      this.msg = UtilityFun.fireStoreCode(err.code);
    })
  }

}
