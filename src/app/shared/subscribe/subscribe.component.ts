import { ContactService } from './../../contact/contact-service.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styles: []
})
export class SubscribeComponent implements OnInit {

  @Input() content = `Welcome to our blog. Subscribe and get our latest blog post in your inbox.`;
  constructor(private contactService: ContactService) { }

  ngOnInit() {
  }

  onSubscribe(email: string) {
    // console.log(email);
    this.contactService.addSubscriber(email);

  }

}
