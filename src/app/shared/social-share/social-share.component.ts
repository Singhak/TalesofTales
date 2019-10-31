import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-social-share',
  template: `
  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
  <share-buttons [theme]="'modern-dark'"
      [include]="['facebook','twitter','linkedin','pinterest','reddit','messenger','whatsapp']" [showCount]="true"
      [url]="shareUrl" [title]="'Tales Of Tales'" [description]="desc" [image]="imgPath" [tags]="hasTags" [autoSetMeta]=true>
  </share-buttons>
</div>
  `,
  styles: []
})
export class SocialShareComponent implements OnInit {

  @Input() shareUrl = 'http://talesoftales.com';
  @Input() desc;
  @Input() imgPath;
  hasTags = 'poem, painting, stories, arts, love, breakup, blog, shayri, gazal, tales, tale, story';
  constructor() { }

  ngOnInit() {
  }

}
