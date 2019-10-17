import { UtilityFun } from './../shared/utility';
import { ContactService } from './contact-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  submit = false;
  // @Input() show = false;
  // @Input() customClass = '';
  // @Input() closeCallback = () => (false);
  constructor(private contactService: ContactService) {
    this.submit = UtilityFun.isInternetConnected();
  }

  ngOnInit() {
  }

  onSubmit(contactFrm: NgForm) {
    console.log(contactFrm);
    if (UtilityFun.isInternetConnected()) {
      this.contactService.sendUserMsg(contactFrm.value).then((resolve) => {
        if (resolve.id) {
          this.submit = true;
          setTimeout(() => {
            this.submit = false;
          }, 1000);
        }
      });
      contactFrm.reset();
      // this.closeCallback();
    } else {
      alert('No internet connection');
    }
  }

}
