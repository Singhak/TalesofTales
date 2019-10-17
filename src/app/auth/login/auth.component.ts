import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  accepted = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  signInWithTwitter() {
    if (this.accepted) {
      this.authService.signInWithTwitter()
        .then((res) => {
          this.router.navigate(['posts']);
        })
        .catch((err) => console.log(err));
    }
  }


  signInWithFacebook() {
    if (this.accepted) {
      this.authService.signInWithFacebook()
        .then((res) => {
          this.router.navigate(['posts']);
        })
        .catch((err) => console.log(err));
    }
  }


  signInWithGoogle() {
    if (this.accepted) {
      this.authService.signInWithGoogle()
        .then((res) => {
          console.log(res);
          this.router.navigate(['posts']);
        })
        .catch((err) => console.log(err));
    }
  }
}
