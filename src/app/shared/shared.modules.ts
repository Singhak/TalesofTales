import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { DisqusModule } from 'ngx-disqus';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SocialShareComponent } from './social-share/social-share.component';
import { LoadingComponent } from './loading-component/loading.component';
import { TrimTextPipe } from '../shared/filter.pipe';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

@NgModule({

    imports: [
        LazyLoadImageModule,
        DisqusModule.forRoot('talesoftales'),
        CommonModule,
        ShareButtonsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        FormsModule,
        CommonModule,
        MarkdownModule.forRoot({
            markedOptions: {
              provide: MarkedOptions,
              useValue: {
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: false,
                smartLists: true,
                smartypants: false
              }
            }
          })
    ],
    exports: [
        CommonModule,
        LazyLoadImageModule,
        TrimTextPipe,
        DisqusModule,
        CommonModule,
        LoadingComponent,
        SocialShareComponent,
        ShareButtonsModule,
        FormsModule,
        ReactiveFormsModule,
        SubscribeComponent,
        ThankyouComponent,
        MarkdownModule
    ],
    declarations: [TrimTextPipe, LoadingComponent, SocialShareComponent, SubscribeComponent, ThankyouComponent],
})
export class SharedModule { }
