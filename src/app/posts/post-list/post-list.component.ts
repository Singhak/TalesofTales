import { PostService } from './../post-service.service';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post-service.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityFun } from 'src/app/shared/utility';

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

  constructor(private postService: PostService, private toastService: ToastrService) { }

  ngOnInit() {
    if(!UtilityFun.isInternetConnected()) {
      this.toastService.info('Please check your internet connection.', 'Information', {
        timeOut: 8000
      });
    }
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
