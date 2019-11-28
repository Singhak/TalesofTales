import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/posts/post-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-post',
  template: `
  <section class="blog-list px-3 py-5 p-md-5">
  <div class="container" style="text-align: center">
      <app-loading *ngIf="loading"></app-loading>
      <div class="item mb-5" *ngFor="let post of posts">
          <app-post-item [post]="post" [isDraft]="isDraft"></app-post-item>
      </div>
  </div>
  <div *ngIf="post && !loading">
  No Post available.
  </div>
</section>
  `,
  styles: []
})
export class ProfilePostComponent implements OnInit {

  id: string;
  posts: any;
  isDraft: boolean;
  loading = false;
  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.parent.params['value']['id'];
    this.route.params.subscribe((param) => {
      const type = param['type'];
      if (type === 'draft') {
        this.getPosts(this.id, 'modposts');
      } else if (type === 'posts') {
        this.getPosts(this.id, 'Posts');
      }
    });


  }

  getPosts(id: string, collection: string) {
    this.loading = true;
    this.postService.getPostOfUser(id, collection).subscribe((post) => {
      this.loading = false;
      console.log(post);
      this.posts = post;
      if (collection === 'Posts') {
        this.isDraft = false;
      } else {
        this.isDraft = true;
      }
    }, (err) => {
      this.loading = false;
      console.log(err);
    })
  }

}
