import { PostService } from './../post-service.service';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post-service.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  disablePrev = false;
  disableNext = false;
  paginationClickedCount = 0;
  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.postService.loadPosts();
    this.postService.postSubscription.subscribe((posts) => {
      if (posts && posts.length) {
        this.posts = posts;
      }
      this.disableNext = this.postService.disable_next;
      this.disablePrev = this.postService.disable_prev;
      this.paginationClickedCount = this.postService.pagination_clicked_count;
    });
  }

  getPosts() {
    this.postService.postSubscription.subscribe((posts) => {
      if (posts && posts.length) {
        this.posts = posts;
      }
    });
  }

  next() {
    this.postService.nextPage();
  }
  prev() {
    this.postService.prevPage();
  }

}
