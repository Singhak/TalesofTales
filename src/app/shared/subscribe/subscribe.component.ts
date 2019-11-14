import { ContactService } from './../../contact/contact-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UtilityFun } from '../utility';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styles: []
})
export class SubscribeComponent implements OnInit {

  @Input() content = `Welcome to our blog. Subscribe and get our latest blog post in your inbox.`;
  constructor(private contactService: ContactService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  onSubscribe(email: string) {
    // console.log(email);
    let isValid = UtilityFun.ValidateEmail(email)
    if (isValid) {
      this.contactService.addSubscriber(email);
      this.toastrService.success('Thanking you fro subscribing.', 'Success', {
        timeOut: 5000
      });
    } else {
      this.toastrService.warning('Please enter the valid email id to subscribe', 'Alert', {
        timeOut: 5000
      });
    }

  }

}
