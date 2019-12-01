import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-social-share',
  template: `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
  <share-buttons [theme]="'modern-dark'"
      [include]="['facebook','twitter','linkedin','pinterest','reddit','messenger','whatsapp']" [showCount]="true"
      [url]="shareUrl" [title]="title" [description]="desc" [image]="imgPath" [tags]="hasTags" [autoSetMeta]=true>
  </share-buttons>
</div>
  `,
  styles: []
})
export class SocialShareComponent implements OnInit {

  @Input() shareUrl = 'http://talesoftales.com';
  @Input() desc: string;
  @Input() imgPath = 'https://cdn.pixabay.com/photo/2016/01/09/18/28/old-1130743_960_720.jpg';
  @Input() title: string;
  hasTags = 'poem, painting, stories, arts, love, breakup, blog, shayri, gazal, tales, tale, story';
  constructor() { }

  ngOnInit() {
  }

}
