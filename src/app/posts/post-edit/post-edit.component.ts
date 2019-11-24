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
  label = "New Post";

  @ViewChild('postform', { static: true }) editform: NgForm;

  constructor(private fb: FormBuilder, private markdownService: MarkdownService,
    private route: ActivatedRoute, private postService: PostService, private router: Router,
    private authService: AuthService, private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.editorOptions = {
      autofocus: true,
      iconlibrary: 'fa',
      savable: false,
      onShow: (e) => this.bsEditorInstance = e,
      parser: (val) => this.parse(val)
    };
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.id = params.id;
        this.label = 'Edit Post';
        const postObj = this.postService.getPost(params['id']);
        if (isObservable(postObj)) {
          postObj.subscribe((post: Post) => {
            this.uid = post.uid;
            this.name = post.author;
            this.buildForm(post as Post);
          });
        } else {
          this.uid = postObj.uid;
          this.buildForm(postObj);
        }
      }
    });

    this.authService.userDetail.pipe(take(1)).subscribe(user => {
      if (!this.id) {
        this.uid = user.id;
        this.name = user.name;
      }
    })
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
      imgPath: pf.value.imgpath ? pf.value.imgpath : '',
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
      this.router.navigate(['/posts']);
    }).catch((err: any) => {
      const code = UtilityFun.fireStoreCode(err.code)
      this.toastrService.error(code, 'Error', {
        timeOut: 5000
      });
    });
    // this.editform.form.reset();
    this.templateForm.reset();
  }

  buildForm(post: Post) {
    this.name = post.author;
    setTimeout(() => {
      this.editform.form.patchValue({
        title: post.title,
        imgPath: post.imgPath,
        category: post.category.toLowerCase(),
        name: post.author
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
