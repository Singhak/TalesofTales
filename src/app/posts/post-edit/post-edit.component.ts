import { Params, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

import { MarkdownService } from 'ngx-markdown';
import { PostService } from './../post-service.service';
import { EditorInstance, EditorOption } from '../../../lib/angular-markdown-editor';
import { Post } from '../post-service.service';
import { isObservable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UtilityFun } from 'src/app/shared/utility';
import { Location } from '@angular/common';

@Component({
  templateUrl: './post-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./post-edit.component.css']
})

export class PostEditComponent implements OnInit {
  bsEditorInstance: EditorInstance;
  markdownText: string;
  showEditor = true;
  templateForm: FormGroup;
  editorOptions: EditorOption;
  id: string = null;
  uid: string = null;
  name: string;
  isDraft: string;
  label = "New Post";

  @ViewChild('postform', { static: true }) editform: NgForm;

  constructor(private fb: FormBuilder, private markdownService: MarkdownService,
    private route: ActivatedRoute, private postService: PostService, private router: Router,
    private authService: AuthService, private toastrService: ToastrService, private location:Location) {
    this.editorOptions = {
      autofocus: true,
      iconlibrary: 'fa',
      savable: false,
      onShow: (e) => this.bsEditorInstance = e,
      parser: (val) => this.parse(val)
    };
  }

  ngOnInit() {
    let postObj: any;
    this.isDraft = this.route.snapshot.queryParamMap.get('isDraft')
    this.id = this.route.snapshot.params['id'];
    if (this.isDraft === 'true') {
      postObj = this.postService.getPostById(this.id, 'modposts');
    } else {
      if (this.id) {
        this.label = 'Edit Post';
        postObj = this.postService.getPost(this.id);
        if (!isObservable(postObj)) {
          this.uid = postObj.uid;
          this.buildForm(postObj);
        }
      }
    }

    if (isObservable(postObj)) {
      postObj.subscribe((post: any) => {
        this.uid = post.uid;
        this.name = post.author;
        this.buildForm(post as Post);
      }, (err) => {
        console.log(err);
      });
    }

    this.authService.userDetail.pipe(take(1)).subscribe(user => {
      if (!this.id) {
        this.uid = user.id;
        this.name = user.name;
      }
    })
  }

  onDelete(id: string, collection: string, ask = true) {
    var result = confirm("Do you Want to delete this draft?");
    if (result && ask) {
      this.postService.deletePost(id, collection).then(() => {
        // this.router.navigate(['/posts']);
        this.location.back();
      }).catch((err) => {
        console.log(err);
      });
    } else if(!ask) {
      this.postService.deletePost(id, collection)
    }
  }

  onSubmit(isDraft, pf: NgForm) {
    if (!this.markdownText) {
      this.toastrService.error('Please Enter content', 'Error', {
        timeOut: 5000
      });
      return;
    }
    const data: Post = {
      title: pf.value.title,
      content: this.markdownText,
      postDate: Date.now().toString(),
      category: pf.value.category,
      author: this.name,
      imgPath: pf.value.imgpath ? pf.value.imgpath : 'https://cdn.pixabay.com/photo/2016/01/09/18/28/old-1130743_960_720.jpg',
      uid: this.uid
    };
    let msg = 'Successfully posted/updated.';
    let postPromise;
    if (isDraft) {
      msg = 'Draft successfully saved';
      postPromise = this.postService.saveAs(data, this.id, 'modposts');
    } else {
      msg = "Post successfully published."
      postPromise = this.postService.saveAs(data, this.id, 'Posts');
    }
    postPromise.then((data: any) => {
      this.toastrService.success(msg, 'Success', {
        timeOut: 8000
      });
      if (this.isDraft === 'true') {
        this.onDelete(this.id, 'modposts', false);
      }
      // this.router.navigate(['/posts']);
      this.location.back();
    }).catch((err: any) => {
      const code = UtilityFun.fireStoreCode(err.code)
      this.toastrService.error(code, 'Error', {
        timeOut: 5000
      });
    });
  }

  buildForm(post: Post) {
    this.name = post.author;
    setTimeout(() => {
      this.editform.form.patchValue({
        title: post.title,
        imgPath: post.imgPath,
        category: post.category.toLowerCase(),
        name: post.author,
        imgpath: post.imgPath
      });
      this.markdownText = post.content;
      this.templateForm = this.fb.group({
        body: [this.markdownText],
        isPreview: [true],
      });
    });
  }

  /** highlight all code found, needs to be wrapped in timer to work properly */
  highlight() {
    setTimeout(() => {
      this.markdownService.highlight();
    });
  }

  hidePreview() {
    if (this.bsEditorInstance && this.bsEditorInstance.hidePreview) {
      this.bsEditorInstance.hidePreview();
    }
  }

  showFullScreen(isFullScreen: boolean) {
    if (this.bsEditorInstance && this.bsEditorInstance.setFullscreen) {
      this.bsEditorInstance.showPreview();
      this.bsEditorInstance.setFullscreen(isFullScreen);
    }
  }

  parse(inputValue: string) {
    const markedOutput = this.markdownService.compile(inputValue.trim());
    this.highlight();
    return markedOutput;
  }
}
