import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMarkdownEditorModule } from './../../lib/angular-markdown-editor/angular-markdown-editor.module';
import { PostsComponent } from './posts.component';
import { PostItemComponent } from './post-item/post-item.component';
import { PostListComponent } from './post-list/post-list.component';
import { NgModule } from '@angular/core';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostRoutingModule } from './post.routing';
import { SharedModule } from '../shared/shared.modules';
import { PostEditComponent } from './post-edit/post-edit.component';

@NgModule({
  declarations: [
    PostListComponent,
    PostItemComponent,
    PostsComponent,
    PostDetailComponent,
    PostEditComponent,
  ],
  imports: [
    PostRoutingModule,
    SharedModule,
    AngularMarkdownEditorModule.forRoot({
      iconlibrary: 'glyph'
    }),
  ],
  exports: [PostRoutingModule]
})
export class PostModule { }
