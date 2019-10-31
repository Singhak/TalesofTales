import { AuthService } from './../auth/auth.service';
import { configuration } from './../configuration';
import { Component, OnInit } from '@angular/core';
import { User } from '../auth/user.model';

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
  photUrl: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.userDetail.subscribe(
      (user: User) => {
        if (user) {
          this.isLogin = true;
          this.usetName = user.name;
          this.photUrl = user.photoURL;
        } else {
          this.isLogin = false;
          this.usetName = 'Tales of Tales';
          this.photUrl = '';
        }
      }
    );
  }

  onLogOut() {
    console.log('Loging Out');

    this.authService.logout();
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

}
