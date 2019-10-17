import { Component, OnInit } from '@angular/core';
import { ContactService } from './contact.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styles: [
    `
    input.ng-invalid.ng-touched{
      border: 1px solid red;
    }

    textarea.ng-invalid.ng-touched{
      border: 1px solid red;
    }

    .content-text {
      padding:20px;
    }

    `
  ]
})
export class ContactComponent implements OnInit {

  constructor(private contactService: ContactService) { }

  ngOnInit() {
  }

  onSubmit(contactFrm: NgForm) {
    console.log(contactFrm);
    // this.contactService.sendUserMsg(contactFrm.value).then((resolve) => {
    //   if (resolve.id) {
    //     // this.submit = true;
    //     setTimeout(() => {
    //       // this.submit = false;
    //     }, 1000);
    //   }
    // });
    contactFrm.reset();
  }

}
