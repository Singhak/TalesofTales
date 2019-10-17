import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

import { MarkdownService } from 'ngx-markdown';
import { PostService } from './../post-service.service';
import { EditorInstance, EditorOption } from '../../../lib/angular-markdown-editor';
import { Post } from '../post-service.service';
import { isObservable } from 'rxjs';

@Component({
  templateUrl: './post-edit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./post-edit.component.css']
})
// tslint:disable: align
export class PostEditComponent implements OnInit {
  bsEditorInstance: EditorInstance;
  markdownText: string;
  showEditor = true;
  templateForm: FormGroup;
  editorOptions: EditorOption;
  id: string;

  @ViewChild('postform', { static: true }) editform: NgForm;

  constructor(private fb: FormBuilder, private markdownService: MarkdownService,
    private route: ActivatedRoute, private postService: PostService) { }

  ngOnInit() {
    this.editorOptions = {
      autofocus: false,
      iconlibrary: 'fa',
      savable: false,
      onShow: (e) => this.bsEditorInstance = e,
      parser: (val) => this.parse(val)
    };
    this.route.params.subscribe((params) => {
      // console.log(params['id']);
      if (params.id) {
        const postObj = this.postService.getPost(params['id']);
        if (isObservable(postObj)) {
          postObj.subscribe((post) => {
            console.log(post);
            this.buildForm(post as Post);
          });
        } else {
          this.buildForm(postObj);
        }
      }
    });
  }
  onSubmit(pf: NgForm) {
    console.log(pf);
    const data: Post = {
      title: pf.value.title,
      subtitle: pf.value.subtitle,
      content: this.markdownText,
      postDate: Date.now().toString(),
      category: pf.value.category,
      author: pf.value.author,
      imgPath: pf.value.imgpath ? pf.value.imgpath : ''
    }; // pf.value.title;
    this.postService.createPost(data);
    this.editform.form.reset();
    this.templateForm.reset();
  }

  buildForm(post: Post) {
    setTimeout(() => {
      this.editform.form.patchValue({
        title: post.title,
        subtitle: post.subtitle
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
