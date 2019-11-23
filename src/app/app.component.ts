import { Component } from '@angular/core';
import { MessagingService } from './messaging.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TalesofTales';

  constructor(private messagingService: MessagingService, private toastService: ToastrService) { }

  ngOnInit() {
    this.toastService.info('Welcome To TalesOfTales', 'Message', { timeOut: 5000 })
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
  }
}
