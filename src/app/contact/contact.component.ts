import { UtilityFun } from './../shared/utility';
import { ContactService } from './contact-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  constructor(private contactService: ContactService, private toastService: ToastrService) {
    this.submit = UtilityFun.isInternetConnected();
  }

  ngOnInit() {
  }

  onSubmit(contactFrm: NgForm) {
    console.log(contactFrm);
    if (UtilityFun.isInternetConnected()) {
      this.contactService.sendUserMsg(contactFrm.value).then((resolve) => {
        if (resolve.id) {
          this.toastService.success('Thanks for writing us', 'Thank You', { timeOut: 5000 });
          this.submit = true;
          setTimeout(() => {
            this.submit = false;
          }, 1000);
        }
      });
      contactFrm.reset();
      // this.closeCallback();
    } else {
      this.toastService.info('Check your internet connection', 'No Internet', { timeOut: 5000 });
    }
  }

}
