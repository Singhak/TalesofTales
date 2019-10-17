import { AuthService } from './../auth/auth.service';
import { configuration } from './../configuration';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  home = configuration.home;
  social = configuration.social;
  usetName = 'Tales of Tales';
  isLogin = false;
  showModal = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.user.subscribe(
      (user) => {
        if (user) {
          this.isLogin = true;
          this.usetName = user.displayName;
        } else {
          this.isLogin = false;
          this.usetName = 'Tales of Tales';
        }
      }
    );
  }

  onLogOut() {
    this.authService.logout();
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

}
