import { Component } from '@angular/core';
import { MessagingService } from './messaging.service';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'TalesofTales';

  constructor(private messagingService: MessagingService, private toastService: ToastrService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-153193382-1', { 'page_path': event.urlAfterRedirects });
      }
    })
  }

  ngOnInit() {
    this.toastService.info('Welcome To TalesOfTales', 'Message', { timeOut: 5000 })
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
  }
}
