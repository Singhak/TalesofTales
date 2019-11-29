import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(private title: Title, private meta: Meta) { }


  generateTags(config) {
    // default values
    config = {
      title: 'TalesOfTales',
      description: 'Poems and Stories are collections of words that express an idea or emotion or feeling or random thoughts that often use imagery and metaphor. TalesOTales is here for you. You can read or write here.',
      image: 'https://talesoftales.com/assets/images/defaults/default.jpg',
      ...config
    }

    this.meta.updateTag({ name: "twitter:image:alt", content: "TalesofTales" })
    this.meta.updateTag({ name: "twitter:site", content: "@talesoftales02" })
    this.meta.updateTag({ name: "twitter:card", content: "summary_large_image" })
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'TalesOfTales' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({ property: 'og:url', content: config.url });
  }
}
