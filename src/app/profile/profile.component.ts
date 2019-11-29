import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouteConfigLoadEnd, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PostService } from '../posts/post-service.service';
import { SeoService } from '../seo.service';
import { UtilityFun } from '../shared/utility';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  isEdit = true;
  userId = null;
  posts = [];
  isDraft: boolean;
  isloading = true;
  constructor(private router: ActivatedRoute, private authSevice:
    AuthService, private postService: PostService, private seoService:SeoService) { }

  ngOnInit() {
    this.router.params.subscribe((params) => {
      let paramId = params.id
      if (paramId) {
        this.authSevice.getUserData(params.id).subscribe((user) => {
          this.user = user;
          if (user && this.userId && this.user.uid === this.userId) {
            this.isEdit = true;
            this.isloading = false;
            this.setMetaTag()
          } else {
            this.isloading = false;
          }
        })

        this.authSevice.userDetail.subscribe((user) => {
          this.userId = user.id
          if (this.user && this.user.uid === user.id) {
            this.isEdit = true;
          }
        })
      }
    });
  }

  setMetaTag() {
    this.seoService.generateTags({
      title: this.user.name,
      url: window.location.href,
      description: UtilityFun.trimContent(this.user.bio, 26)
    })
  }

}
